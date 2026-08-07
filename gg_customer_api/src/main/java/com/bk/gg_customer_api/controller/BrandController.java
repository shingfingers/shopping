package com.bk.gg_customer_api.controller;

import com.bk.common.pojo.Brand;
import com.bk.common.result.BaseResult;
import com.bk.common.service.BrandService;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 品牌
 * 供前端首页品牌专区、商品列表品牌筛选使用
 */
@RestController
@RequestMapping("/user/brand")
public class BrandController {

    @DubboReference
    private BrandService brandService;

    /**
     * 查询所有品牌
     * @return 全部品牌列表
     */
    @GetMapping("/findAll")
    public BaseResult<List<Brand>> findAll() {
        List<Brand> brands = brandService.findAll();
        return BaseResult.ok(brands);
    }
}
