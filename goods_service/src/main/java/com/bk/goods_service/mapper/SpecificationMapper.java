package com.bk.goods_service.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bk.common.pojo.Specification;

import java.util.List;

public interface SpecificationMapper extends BaseMapper<Specification> {
    Specification findById(Long id);
    List<Specification> findByProductTypeId(Long productTypeId);
}
