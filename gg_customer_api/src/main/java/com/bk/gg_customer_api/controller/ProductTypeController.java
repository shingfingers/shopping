package com.bk.gg_customer_api.controller;

import com.bk.common.pojo.ProductType;
import com.bk.common.result.BaseResult;
import com.bk.common.service.ProductTypeService;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 商品分类（商品类型）
 * 供前端首页分类菜单、商品列表筛选使用
 */
@RestController
@RequestMapping("/user/productType")
public class ProductTypeController {

    @DubboReference
    private ProductTypeService productTypeService;

    /**
     * 查询所有商品分类
     * 前端根据 level 和 parentId 构建分类树
     * @return 全部商品分类列表
     */
    @GetMapping("/all")
    public BaseResult<List<ProductType>> findAll() {
        List<ProductType> list = productTypeService.findProductType(new ProductType());
        return BaseResult.ok(list);
    }
}
