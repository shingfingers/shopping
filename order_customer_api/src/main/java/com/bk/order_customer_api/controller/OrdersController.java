package com.bk.order_customer_api.controller;

import com.bk.common.pojo.CartGoods;
import com.bk.common.pojo.Orders;
import com.bk.common.result.BaseResult;
import com.bk.common.service.CartService;
import com.bk.common.service.OrdersService;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/orders")
public class OrdersController {
    @DubboReference
    private OrdersService ordersService;
    @DubboReference
    private CartService cartService;

    /**
     * 生成订单
     *
     * @param orders 订单对象
     * @param userId 用户id
     * @return 生成的订单
     */
    @PostMapping("/add")
    public BaseResult<Orders> add(@RequestBody Orders orders, @RequestHeader("userId") Long userId) {
        // 保存订单
        orders.setUserId(userId);
        Orders orders1 = ordersService.add(orders);
        // 将redis中购物车商品删除
        List<CartGoods> cartGoods = orders.getCartGoods();
        for (CartGoods cartGood : cartGoods) {
            cartService.deleteCartOption(userId,cartGood.getGoodId());
        }
        return BaseResult.ok(orders1);
    }

    /**
     * 根据id查询订单详情
     * @param id 订单id
     * @return 查询结果
     */
    @GetMapping("/findById")
    public BaseResult<Orders> findById(String id){
        Orders orders = ordersService.findById(id);
        return BaseResult.ok(orders);
    }

    /**
     * 查询用户的订单
     * @param status 订单状态：1.未付款 2.已付款 3.未发货 4.已发货 5.交易成功 6.交易关闭 7.待评价，传入空值代表查询所有
     * @param userId 用户id
     * @return 查询结果
     */
    @GetMapping("/findUserOrders")
    public BaseResult<List<Orders>> findUserOrders(Integer status,@RequestHeader("userId") Long userId){
        List<Orders> orders = ordersService.findUserOrders(userId, status);
        return BaseResult.ok(orders);
    }

    /**
     * 取消订单（未付款订单关闭，status 置为 6 交易关闭）
     * updateById 只更新非 null 字段，不会覆盖其他字段
     * @param id 订单id
     * @return 操作结果
     */
    @PostMapping("/cancel/{id}")
    public BaseResult cancelOrder(@PathVariable("id") String id){
        Orders orders = new Orders();
        orders.setId(id);
        orders.setStatus(6); // 交易关闭
        orders.setCloseTime(new java.util.Date());
        ordersService.update(orders);
        return BaseResult.ok();
    }

    /**
     * 确认收货（已发货订单完成，status 置为 5 交易成功）
     * updateById 只更新非 null 字段，不会覆盖其他字段
     * @param id 订单id
     * @return 操作结果
     */
    @PostMapping("/confirm/{id}")
    public BaseResult confirmReceive(@PathVariable("id") String id){
        Orders orders = new Orders();
        orders.setId(id);
        orders.setStatus(5); // 交易成功
        orders.setEndTime(new java.util.Date());
        ordersService.update(orders);
        return BaseResult.ok();
    }
}
