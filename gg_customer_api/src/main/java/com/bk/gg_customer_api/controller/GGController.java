package com.bk.gg_customer_api.controller;

import com.bk.common.pojo.Category;
import com.bk.common.result.BaseResult;
import com.bk.common.service.GGService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.List;

/**
 * 广告
 */
@RestController
@RequestMapping("/user/category")
public class GGController {
    @DubboReference
    private GGService categoryService;

    @GetMapping("/all")
    public BaseResult<List<Category>> findAll(){
//        try {
//            Thread.sleep(2000);
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }
        List<Category> categories = categoryService.findAll();
        return BaseResult.ok(categories);
    }

    @GetMapping("/test")
    public BaseResult test(HttpServletRequest request){
        Enumeration<String> headerNames = request.getHeaderNames();
        return BaseResult.ok();
    }

}
