package com.bk.user_service.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.bk.common.pojo.ShoppingUser;
import com.bk.common.result.BusException;
import com.bk.common.result.CodeEnum;
import com.bk.common.service.ShoppingUserService;
import com.bk.common.util.Md5Util;
import com.bk.user_service.mapper.ShoppingUserMapper;
import com.bk.user_service.util.JwtUtils;
import org.apache.dubbo.config.annotation.DubboService;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@DubboService
public class ShoppingUserServiceImpl implements ShoppingUserService {
    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private ShoppingUserMapper shoppingUserMapper;

    @Override
    public void saveRegisterCheckCode(String email, String checkCode) {
        ValueOperations valueOperations = redisTemplate.opsForValue();
        // redis中保存的键为邮箱，值为验证码，过期时间5分钟
        valueOperations.set("registerCode:"+email,checkCode,300, TimeUnit.SECONDS);
    }


    @Override
    public void registerCheckCode(String email, String checkCode) {
        ValueOperations valueOperations = redisTemplate.opsForValue();
        Object checkCodeRedis = valueOperations.get("registerCode:" + email);
        if (!checkCode.equals(checkCodeRedis)){
            throw new BusException(CodeEnum.REGISTER_CODE_ERROR);
        }
    }

    @Override
    public void register(ShoppingUser shoppingUser) {
        // 1.验证邮箱是否存在
        String email = shoppingUser.getEmail();
        QueryWrapper<ShoppingUser> queryWrapper = new QueryWrapper();
        queryWrapper.eq("email",email);
        List<ShoppingUser> shoppingUsers = shoppingUserMapper.selectList(queryWrapper);
        if (shoppingUsers != null && shoppingUsers.size() > 0){
            throw new BusException(CodeEnum.REGISTER_REPEAT_EMAIL_ERROR);
        }
        // 2.验证用户名是否存在
        String username = shoppingUser.getUsername();
        QueryWrapper<ShoppingUser> queryWrapper1 = new QueryWrapper();
        queryWrapper1.eq("username",username);
        List<ShoppingUser> shoppingUsers1 = shoppingUserMapper.selectList(queryWrapper1);
        if (shoppingUsers1 != null && shoppingUsers1.size() > 0){
            throw new BusException(CodeEnum.REGISTER_REPEAT_NAME_ERROR);
        }
        // 3.新增用户
        shoppingUser.setStatus("Y");
        shoppingUser.setPassword(Md5Util.encode(shoppingUser.getPassword()));
        shoppingUserMapper.insert(shoppingUser);
    }

    @Override
    public String loginPassword(String username, String password) throws JoseException {
        // 1.验证用户名
        QueryWrapper<ShoppingUser> queryWrapper = new QueryWrapper();
        queryWrapper.eq("username",username);
        ShoppingUser shoppingUser = shoppingUserMapper.selectOne(queryWrapper);
        if (shoppingUser == null){
            throw new BusException(CodeEnum.LOGIN_NAME_PASSWORD_ERROR);
        }
        // 2.验证密码
        boolean verify = Md5Util.verify(password, shoppingUser.getPassword());
        if (!verify){
            throw new BusException(CodeEnum.LOGIN_NAME_PASSWORD_ERROR);
        }
        // 3.生成JWT令牌，返回令牌
        String sign = JwtUtils.sign(shoppingUser.getId(), shoppingUser.getUsername());
        return sign;
    }

    @Override
    public void saveLoginCheckCode(String email, String checkCode) {
        ValueOperations valueOperations = redisTemplate.opsForValue();
        // redis的键为邮箱，值为验证码，过期时间5分钟
        valueOperations.set("loginCode:"+email,checkCode,300,TimeUnit.SECONDS);
    }

    @Override
    public String loginCheckCode(String email, String checkCode) throws JoseException {
        // 1.验证用户传入的邮箱验证码是否在redis中存在
        ValueOperations valueOperations = redisTemplate.opsForValue();
        Object checkCodeRedis = valueOperations.get("loginCode:" + email);
        if (!checkCode.equals(checkCodeRedis)){
            throw new BusException(CodeEnum.LOGIN_CODE_ERROR);
        }
        // 2.登录成功，根据邮箱查询用户
        QueryWrapper<ShoppingUser> queryWrapper = new QueryWrapper();
        queryWrapper.eq("email",email);
        ShoppingUser shoppingUser = shoppingUserMapper.selectOne(queryWrapper);
        // 3.生成JWT令牌，返回令牌
        String sign = JwtUtils.sign(shoppingUser.getId(), shoppingUser.getUsername());
        return sign;
    }

    @Override
    public String getName(String token) {
        Map<String, Object> verify = JwtUtils.verify(token);
        String username = (String) verify.get("username");
        return username;
    }

    @Override
    public ShoppingUser getLoginUser(String token) {
        // 拿到令牌中的用户id
        Map<String, Object> verify = JwtUtils.verify(token);
        Long userId = (Long) verify.get("userId");
        // 根据id查询用户
        QueryWrapper<ShoppingUser> queryWrapper = new QueryWrapper();
        queryWrapper.eq("id",userId);
        ShoppingUser shoppingUser = shoppingUserMapper.selectOne(queryWrapper);
        return shoppingUser;
    }

    @Override
    public void checkEmail(String email) {
        // 1.判断邮箱是否存在
        QueryWrapper<ShoppingUser> queryWrapper = new QueryWrapper();
        queryWrapper.eq("email",email);
        ShoppingUser shoppingUser = shoppingUserMapper.selectOne(queryWrapper);
        if (shoppingUser == null){
            throw new BusException(CodeEnum.LOGIN_NOEMAIL_ERROR);
        }
        // 2.判断用户状态是否正常
        if (!"Y".equals(shoppingUser.getStatus())){
            throw new BusException(CodeEnum.LOGIN_USER_STATUS_ERROR);
        }
    }


}
