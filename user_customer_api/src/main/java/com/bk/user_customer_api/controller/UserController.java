package com.bk.user_customer_api.controller;

import com.bk.common.pojo.ShoppingUser;
import com.bk.common.result.BaseResult;
import com.bk.common.result.BusException;
import com.bk.common.service.MailService;
import com.bk.common.service.ShoppingUserService;
import com.bk.common.util.RandomUtil;
import org.apache.dubbo.config.annotation.DubboReference;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/user/shoppingUser")
public class UserController {
    @DubboReference
    private MailService mailService;
    @DubboReference
    private ShoppingUserService shoppingUserService;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    /**
     * 发送注册邮箱验证码
     * @param email 注册邮箱
     * @return 操作结果
     */
    @GetMapping("/sendEmailCode")
    public BaseResult sendEmailCode(@RequestParam("email") String email){
        try {
            // 0.限流：同一邮箱 60 秒内只能发送一次
            String limitKey = "sendCodeLimit:" + email;
            if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(limitKey))) {
                return new BaseResult(429, "验证码发送过于频繁，请1分钟后再试", null);
            }
            stringRedisTemplate.opsForValue().set(limitKey, "1", 60, TimeUnit.SECONDS);
            // 1.生成随机四位数验证码
            String checkCode = RandomUtil.buildCheckCode(4);
            // 2.发送邮件
            String text = "<h3>BK商城注册验证码</h3><p>您的注册验证码为：<strong style='color:red;font-size:20px'>" + checkCode + "</strong></p><p>验证码5分钟内有效，请勿泄露给他人。</p>";
            BaseResult result = mailService.sendMail(email, text, "BK商城注册验证码");
            // 3.发送成功，将验证码保存到redis中，发送失败，返回发送结果
            if (200 == result.getCode()){
                shoppingUserService.saveRegisterCheckCode(email,checkCode);
                return BaseResult.ok();
            }else {
                return result;
            }
        } catch (BusException e) {
            return new BaseResult(e.getCode(), e.getMsg(), null);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResult(500, "邮件服务暂时不可用，请稍后重试", null);
        }
    }

    /**
     * 验证用户注册验证码
     * @param email 邮箱
     * @param checkCode 验证码
     * @return 200验证成功，605验证码不正确
     */
    @GetMapping("/registerCheckCode")
    public BaseResult register(@RequestParam("email") String email, @RequestParam("checkCode") String checkCode){
        shoppingUserService.registerCheckCode(email, checkCode);
        return BaseResult.ok();
    }

    /**
     * 用户注册
     * @param shoppingUser 用户信息
     * @return 注册结果
     */
    @PostMapping("/register")
    public BaseResult register(@RequestBody ShoppingUser shoppingUser){
        shoppingUserService.register(shoppingUser);
        return BaseResult.ok();
    }

    /**
     * 用户名密码登录
     * @param shoppingUser 用户对象
     * @return 登录结果
     */
    @PostMapping("/loginPassword")
    public BaseResult loginPassword(@RequestBody ShoppingUser shoppingUser) throws JoseException {
        String sign = shoppingUserService.loginPassword(shoppingUser.getUsername(), shoppingUser.getPassword());
        return BaseResult.ok(sign);
    }

    /**
     * 发送登录邮箱验证码
     * @param email 邮箱
     * @return 操作结果
     */
    @GetMapping("/sendLoginCheckCode")
    public BaseResult sendLoginCheckCode(@RequestParam("email") String email){
        try {
            // 1.判断用户邮箱是否存在，状态是否正常
            shoppingUserService.checkEmail(email);
            // 2.生成随机四位数验证码
            String checkCode = RandomUtil.buildCheckCode(4);
            // 3.发送邮件
            String text = "<h3>BK商城登录验证码</h3><p>您的登录验证码为：<strong style='color:red;font-size:20px'>" + checkCode + "</strong></p><p>验证码5分钟内有效，请勿泄露给他人。</p>";
            BaseResult result = mailService.sendMail(email, text, "BK商城登录验证码");
            // 4.发送成功，将验证码保存到redis中，发送失败，返回发送结果
            if (200 == result.getCode()){
                shoppingUserService.saveLoginCheckCode(email,checkCode);
                return BaseResult.ok();
            }else {
                return result;
            }
        } catch (BusException e) {
            return new BaseResult(e.getCode(), e.getMsg(), null);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResult(500, "邮件服务暂时不可用，请稍后重试", null);
        }
    }

    /**
     * 邮箱验证码登录
     * @param email 邮箱
     * @param checkCode 验证码
     * @return 登录结果
     */
    @PostMapping("/loginCheckCode")
    public BaseResult loginCheckCode(@RequestParam("email") String email, @RequestParam("checkCode") String checkCode) throws JoseException {
        String sign = shoppingUserService.loginCheckCode(email, checkCode);
        return BaseResult.ok(sign);
    }

    /**
     * 获取登录的用户名
     * @param authorization 令牌
     * @return 用户名
     */
    @GetMapping("/getName")
    public BaseResult<String> getName(@RequestHeader("Authorization")String authorization){
        String token = authorization.replace("Bearer ","");
        String name = shoppingUserService.getName(token);
        return BaseResult.ok(name);
    }

}
