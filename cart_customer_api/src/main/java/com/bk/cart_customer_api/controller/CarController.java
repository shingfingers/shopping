package com.bk.cart_customer_api.controller;

import com.bk.common.pojo.CartGoods;
import com.bk.common.result.BaseResult;
import com.bk.common.service.CartService;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 购物车
 */
@RestController
@RequestMapping("/user/cart")
public class CarController {
    @DubboReference
    private CartService cartService;

    /**
     * 查询用户购物车列表
     * @param userId 用户id
     * @return 用户购物车列表
     */
    @GetMapping("/findCartList")
    public BaseResult<List<CartGoods>> findCartList(@RequestHeader("userId") Long userId){
        List<CartGoods> cartList = cartService.findCartList(userId);
        return BaseResult.ok(cartList);
    }

    /**
     * 新增商品到购物车
     * @param cartGoods 购物车商品
     * @param userId 令牌中携带的用户id
     * @return 操作结果
     */
    @PostMapping("/addCart")
    public BaseResult addCart(@RequestBody CartGoods cartGoods,@RequestHeader("userId") Long userId){
        cartService.addCard(userId, cartGoods);
        return BaseResult.ok();
    }

    /**
     * 修改购物车商品数量
     * @param userId 令牌中携带的用户id
     * @param goodId 商品id
     * @param num 修改后的数量
     * @return 操作结果
     */
    @GetMapping("/handleCart")
    public BaseResult addCart(@RequestHeader("userId") Long userId,Long goodId,Integer num){
        cartService.handleCart(userId, goodId, num);
        return BaseResult.ok();
    }

    /**
     * 删除购物车商品
     * @param userId 令牌中携带的用户id
     * @param goodId 商品id
     * @return 操作结果
     */
    @DeleteMapping("/deleteCart")
    public BaseResult deleteCart(@RequestHeader("userId") Long userId,Long goodId){
        cartService.deleteCartOption(userId, goodId);
        return BaseResult.ok();
    }

    /**
     * 清空用户购物车
     * @param userId 令牌中携带的用户id
     * @return 操作结果
     */
    @DeleteMapping("/clear")
    public BaseResult clearCart(@RequestHeader("userId") Long userId){
        cartService.clearCart(userId);
        return BaseResult.ok();
    }
}
