package com.bk.admin_service.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bk.common.pojo.Permission;

public interface PermissionMapper extends BaseMapper<Permission> {
    // 删除角色_权限表中的相关数据
    void deletePermissionAllRole(Long pid);
}
