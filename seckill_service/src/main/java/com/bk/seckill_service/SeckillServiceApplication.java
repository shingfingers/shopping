package com.bk.seckill_service;

import cn.hutool.bloomfilter.BitMapBloomFilter;
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableDiscoveryClient
@EnableDubbo
@RefreshScope
@SpringBootApplication
@EnableScheduling
@MapperScan("com.bk.seckill_service.mapper")
public class SeckillServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SeckillServiceApplication.class, args);
    }

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }

    /**
     * 布隆过滤器 Bean
     * 使用指定预期插入数量和误判率的构造方法，避免内存溢出
     */
    @Bean
    public BitMapBloomFilter bloomFilter() {
        // hutool BitMapBloomFilter(int m) 的参数 m 不是元素数，而是总兆字节数
        // 内部公式: 每个 filter 的位数 = m/5 * 1024 * 1024 * 8
        // m=5 → 每 filter = 5/5=1MB, 5个 filter 共 5MB, 足够支持 10 万条数据
        return new  BitMapBloomFilter(5);
    }
}