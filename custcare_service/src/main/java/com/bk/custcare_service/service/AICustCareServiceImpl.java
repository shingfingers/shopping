package com.bk.custcare_service.service;

import com.github.houbb.sensitive.word.bs.SensitiveWordBs;
import com.bk.common.pojo.CartGoods;
import com.bk.common.pojo.Faq;
import com.bk.common.pojo.GoodsDesc;
import com.bk.common.service.AICustCareService;
import com.bk.common.service.CartService;
import com.bk.common.service.FaqService;
import com.bk.common.service.GoodsService;
import org.apache.dubbo.config.annotation.DubboReference;
import org.apache.dubbo.config.annotation.DubboService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;
import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_RETRIEVE_SIZE_KEY;

/**
 * AI客服服务实现类
 */
@DubboService
public class AICustCareServiceImpl implements AICustCareService {
    @Autowired
    private ChatClient chatClient;
    @Autowired
    private FaqService faqService;
    @Autowired
    private SensitiveWordBs sensitiveWordBs;
    @DubboReference
    private GoodsService goodsService;
    @DubboReference
    private CartService cartService;

    @Value("${spring.ai.dashscope.prompt}")
    private String prompt;

    @Override
    public String generateResponse(String userMessage, Long userId) {
        // 1.检查敏感词
        String error = check(userMessage);
        if (error != null){
            return error;
        }
        // 2.先尝试FAQ回答
        Faq bestAnswer = faqService.findBestAnswer(userMessage);
        if (bestAnswer != null) {
            return bestAnswer.getAnswer();
        }
        // 2.5 加购/立即购买意图处理
        String action = handleCartAction(userMessage, userId);
        if (action != null) {
            return action;
        }
        // 3.如果没有FAQ答案,调用AI模型回答
        String systemPrompt = this.prompt + """
            你是一个专业的电商客服助手，专门处理订单查询和商品查询请求。请严格按照以下规则执行：
              1. **意图识别**：
              - 当用户提及"订单"、"我的订单"、"购买记录"、"待支付"、"已发货"、"最近订单"等关键词时，识别为订单查询意图
              - 当用户提及"商品"、"查找"、"搜索"、"手机"、"衣服"、"价格"、"库存"等关键词时，识别为商品查询意图
              2. **服务调用**：
              - 订单查询意图 → 调用 `getOrderQueryService` 方法
              - 商品查询意图 → 调用 `getGoodsQueryService` 方法
              请确保准确识别用户意图并正确调用相应服务，提取所有可用参数填充到函数调用中，用户ID从prompt获取。
              仅当用户明确要求其他操作或工具无法处理时，才直接回复。
              当前用户的id: {user_id}
        """;
        // 添加当前时间用户Id
        PromptTemplate promptTemplate = new PromptTemplate(systemPrompt);
        String resolvedPrompt = promptTemplate.render(
                Map.of("current_date", LocalDate.now().toString(),
                        "user_id",userId)
        );
        // AI回答
        String content = chatClient
                .prompt()
                .system(resolvedPrompt)
                .user(userMessage)
                // 记忆管理
                .advisors(spec -> spec
                        .param(CHAT_MEMORY_CONVERSATION_ID_KEY, userId) // 使用用户ID作为会话ID
                        .param(CHAT_MEMORY_RETRIEVE_SIZE_KEY,10)) // 检索最近10条消息
                .call()
                .content();
        return content;

    }

    /**
     * 检查文本是否包含敏感词
     * @param text 待检查的文本
     * @return 如果包含敏感词, 返回提示信息; 否则返回null
     */
    private String check(String text){
        if (text == null || text.trim().isEmpty()){
            return "输入内容不能为空";
        }
        if (sensitiveWordBs.contains(text)){
            return "内容包含敏感词汇，这个问题为暂时无法回答，让我们换个话题再聊聊吧！";
        }
        return null;
    }

    // ==================== Add to cart / Buy now ====================
    private static final Pattern ADD_CART_PATTERN = Pattern.compile("\u52a0\u5165\u8d2d\u7269\u8f66|\u52a0\u8d2d|\u6dfb\u52a0\u5230\u8d2d\u7269\u8f66|\u653e\u8fdb\u8d2d\u7269\u8f66|\u653e\u5165\u8d2d\u7269\u8f66");
    private static final Pattern BUY_NOW_PATTERN = Pattern.compile("\u7acb\u5373\u8d2d\u4e70|\u6211\u8981\u4e70|\u60f3\u4e70|\u76f4\u63a5\u4e70|\u4e70\u4e0b|\u73b0\u5728\u4e70");
    private static final Pattern TRIM_PATTERN = Pattern.compile("\u5e2e\u6211|\u9ebb\u70e6|\u8bf7|\u628a|\u5c06|\u4e00\u4e0b|\u8fd9\u4e2a|\u90a3\u4e2a|\u5546\u54c1|\u7684|\u4e86|\u5427|\u5462|\u5440|\u54e6|\u554a");

    /**
     * Handle add-cart / buy-now intent. Return reply if handled, null to continue to AI.
     */
    private String handleCartAction(String userMessage, Long userId) {
        boolean isAddCart = ADD_CART_PATTERN.matcher(userMessage).find();
        boolean isBuyNow = BUY_NOW_PATTERN.matcher(userMessage).find();
        if (!isAddCart && !isBuyNow) {
            return null;
        }
        String name = extractGoodsName(userMessage, isAddCart, isBuyNow);
        if (name.isEmpty()) {
            return "\u8bf7\u544a\u8bc9\u6211\u60a8\u60f3\u8d2d\u4e70\u7684\u5546\u54c1\u540d\u79f0\u54e6\uff0c\u6bd4\u5982\u201c\u628a iPhone 14 \u52a0\u5165\u8d2d\u7269\u8f66\u201d\uff5e";
        }
        GoodsDesc goods = findGoods(name);
        if (goods == null) {
            return "\u62b1\u6b49\uff0c\u6ca1\u6709\u627e\u5230\u300c" + name + "\u300d\u76f8\u5173\u7684\u5546\u54c1\uff0c\u60a8\u53ef\u4ee5\u6362\u4e2a\u5173\u952e\u8bcd\u8bd5\u8bd5\uff5e";
        }
        if (isAddCart) {
            CartGoods cartGoods = new CartGoods();
            cartGoods.setGoodId(goods.getId());
            cartGoods.setGoodsName(goods.getGoodsName());
            cartGoods.setPrice(goods.getPrice());
            cartGoods.setHeaderPic(goods.getHeaderPic());
            cartGoods.setNum(1);
            cartService.addCard(userId, cartGoods);
            return "\u5df2\u4e3a\u60a8\u5c06\u300c" + goods.getGoodsName() + "\u300d\uff08\u00a5" + goods.getPrice() + "\uff09\u52a0\u5165\u8d2d\u7269\u8f66\u5566\uff01\u53ef\u524d\u5f80\u8d2d\u7269\u8f66\u67e5\u770b\uff5e";
        }
        return "\u4e3a\u60a8\u627e\u5230\u300c" + goods.getGoodsName() + "\u300d\uff08\u00a5" + goods.getPrice() + "\uff09\uff0c\u70b9\u51fb\u4e0b\u65b9\u6309\u94ae\u786e\u8ba4\u540e\u7acb\u5373\u8d2d\u4e70\uff5e【BUY_NOW:" + goods.getId() + ":" + goods.getGoodsName() + "】";
    }

    private String extractGoodsName(String msg, boolean isAddCart, boolean isBuyNow) {
        String name = msg;
        if (isAddCart) {
            name = ADD_CART_PATTERN.matcher(name).replaceAll("");
        }
        if (isBuyNow) {
            name = BUY_NOW_PATTERN.matcher(name).replaceAll("");
        }
        name = TRIM_PATTERN.matcher(name).replaceAll("");
        return name.trim();
    }

    private GoodsDesc findGoods(String name) {
        List<GoodsDesc> all = goodsService.findAll();
        if (all == null || all.isEmpty()) {
            return null;
        }
        for (GoodsDesc g : all) {
            if (g.getGoodsName() != null && g.getGoodsName().contains(name)) {
                return g;
            }
        }
        return null;
    }

}
