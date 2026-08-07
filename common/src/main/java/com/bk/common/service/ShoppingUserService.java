package com.bk.common.service;

import com.bk.common.pojo.ShoppingUser;
import org.jose4j.lang.JoseException;

/**
 * 商城用户服务
 */
public interface ShoppingUserService {
    // 注册时在redis中保存邮箱+验证码
    void saveRegisterCheckCode(String email,String checkCode);
    // 注册时验证邮箱验证码
    void registerCheckCode(String email,String checkCode);
    // 用户注册
    void register(ShoppingUser shoppingUser);

    // 用户名密码登录
    String loginPassword(String username,String password) throws org.jose4j.lang.JoseException;

    // 登录时在redis中保存邮箱+验证码
    default void saveLoginCheckCode(String email, String checkCode) {

    }

    // 邮箱验证码登录
    String loginCheckCode(String email,String checkCode) throws JoseException;

    // 获取登录用户名
    String getName(String token);
    // 根据令牌获取用户
    ShoppingUser getLoginUser(String token);
    // 判断用户邮箱是否存在，状态是否正常
    void checkEmail(String email);
}