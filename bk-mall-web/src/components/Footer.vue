<template>
  <footer class="app-footer">
    <!-- 服务保障 -->
    <div class="footer-service">
      <div class="footer-inner">
        <div v-for="item in services" :key="item.title" class="service-item">
          <el-icon :size="36" :color="item.color">
            <component :is="item.icon" />
          </el-icon>
          <div class="service-text">
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 帮助中心 -->
    <div class="footer-links">
      <div class="footer-inner">
        <div v-for="col in linkColumns" :key="col.title" class="link-column">
          <h4>{{ col.title }}</h4>
          <ul>
            <li v-for="link in col.links" :key="link.name">
              <router-link :to="link.to">{{ link.name }}</router-link>
            </li>
          </ul>
        </div>

        <!-- 联系我们 -->
        <div class="link-column contact-column">
          <h4>联系我们</h4>
          <div class="contact-info">
            <p class="phone">400-888-6666</p>
            <p>周一至周日 9:00-22:00</p>
            <p>service@bkmall.com</p>
          </div>
          <div class="qr-codes">
            <div class="qr-item">
              <div class="qr-placeholder"><img :src="qrCodeImage" alt="二维码" /></div>
              <span>官方商城APP</span>
            </div>
            <div class="qr-item">
              <div class="qr-placeholder"><img :src="qrCodeImage" alt="二维码" /></div>
              <span>微信公众号</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer-bottom">
      <div class="footer-inner">
        <p>
          © 2024 BK商城 bkmall.com 版权所有 | 京ICP备2024000001号-1 |
          京公网安备 11000000000001号
        </p>
        <p>BK商城 - 品质生活，尽在BK</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const services = [
  { title: '品质保证', desc: '正品保障 品质护航', icon: 'CircleCheckFilled', color: '#67C23A' },
  { title: '极速物流', desc: '次日直达 送货上门', icon: 'Van', color: '#409EFF' },
  { title: '售后无忧', desc: '七天无理由退换货', icon: 'RefreshRight', color: '#E6A23C' },
  { title: '客服在线', desc: '7×24小时在线服务', icon: 'Headset', color: '#F56C6C' },
]

const linkColumns = [
  {
    title: '购物指南',
    links: [
      { name: '购物流程', to: '/products' },
      { name: '会员介绍', to: '/' },
      { name: '常见问题', to: '/' },
      { name: '联系客服', to: '/' },
    ],
  },
  {
    title: '配送方式',
    links: [
      { name: '上门自提', to: '/orders' },
      { name: '快递运输', to: '/orders' },
      { name: '物流配送', to: '/orders' },
      { name: '配送范围', to: '/orders' },
    ],
  },
  {
    title: '支付方式',
    links: [
      { name: '货到付款', to: '/orders' },
      { name: '在线支付', to: '/orders' },
      { name: '分期付款', to: '/orders' },
      { name: '银行转账', to: '/orders' },
    ],
  },
  {
    title: '售后服务',
    links: [
      { name: '退换货政策', to: '/orders' },
      { name: '退换货流程', to: '/orders' },
      { name: '价格保护', to: '/orders' },
      { name: '投诉建议', to: '/' },
    ],
  },
]

// 生成简单二维码占位图
function generateQrCode() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <rect fill="#fff" width="80" height="80"/>
    <rect x="4" y="4" width="20" height="20" fill="#333"/>
    <rect x="8" y="8" width="12" height="12" fill="#fff"/>
    <rect x="11" y="11" width="6" height="6" fill="#333"/>
    <rect x="56" y="4" width="20" height="20" fill="#333"/>
    <rect x="60" y="8" width="12" height="12" fill="#fff"/>
    <rect x="63" y="11" width="6" height="6" fill="#333"/>
    <rect x="4" y="56" width="20" height="20" fill="#333"/>
    <rect x="8" y="60" width="12" height="12" fill="#fff"/>
    <rect x="11" y="63" width="6" height="6" fill="#333"/>
    <rect x="32" y="8" width="4" height="4" fill="#333"/>
    <rect x="40" y="12" width="4" height="4" fill="#333"/>
    <rect x="36" y="20" width="4" height="4" fill="#333"/>
    <rect x="44" y="24" width="4" height="4" fill="#333"/>
    <rect x="32" y="32" width="4" height="4" fill="#333"/>
    <rect x="40" y="36" width="4" height="4" fill="#333"/>
    <rect x="48" y="40" width="4" height="4" fill="#333"/>
    <rect x="56" y="44" width="4" height="4" fill="#333"/>
    <rect x="36" y="48" width="4" height="4" fill="#333"/>
    <rect x="44" y="56" width="4" height="4" fill="#333"/>
    <rect x="52" y="60" width="4" height="4" fill="#333"/>
    <rect x="60" y="64" width="4" height="4" fill="#333"/>
    <rect x="68" y="68" width="4" height="4" fill="#333"/>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}
const qrCodeImage = generateQrCode()
</script>

<style scoped lang="scss">
.app-footer {
  background: #1e1e2e;
  color: #b0b0c0;
  margin-top: 40px;
}

.footer-inner {
  width: $layout-width;
  margin: 0 auto;
  padding: 0 20px;
}

// 服务保障
.footer-service {
  background: #fff;
  border-bottom: 1px solid $border-color-light;

  .footer-inner {
    display: flex;
    justify-content: space-around;
    padding-top: 24px;
    padding-bottom: 24px;
  }

  .service-item {
    display: flex;
    align-items: center;
    gap: 12px;

    .service-text {
      h4 {
        font-size: 16px;
        color: $text-primary;
        margin-bottom: 2px;
      }

      p {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
}

// 帮助中心链接
.footer-links {
  padding: 40px 0 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  .footer-inner {
    display: flex;
    gap: 60px;
  }

  .link-column {
    h4 {
      font-size: 15px;
      color: #e0e0e8;
      margin-bottom: 14px;
      font-weight: 500;
    }

    ul {
      list-style: none;

      li {
        margin-bottom: 8px;

        a {
          color: #8888a0;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;

          &:hover {
            color: $primary-light;
          }
        }
      }
    }
  }

  .contact-column {
    flex: 1;
    text-align: center;

    .contact-info {
      margin-bottom: 16px;

      .phone {
        font-size: 22px;
        color: $primary-light;
        font-weight: 700;
        margin-bottom: 6px;
      }

      p {
        font-size: 12px;
        color: #8888a0;
        margin-bottom: 2px;
      }
    }
  }

  .qr-codes {
    display: flex;
    justify-content: center;
    gap: 24px;

    .qr-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;

      .qr-placeholder {
        width: 90px;
        height: 90px;
        background-color: #fff;
        border-radius: 6px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      span {
        font-size: 11px;
        color: #8888a0;
      }
    }
  }
}

// 底部信息
.footer-bottom {
  padding: 20px 0;
  text-align: center;

  p {
    font-size: 12px;
    color: #6a6a80;
    margin-bottom: 4px;
  }
}

// ========== 响应式适配 ==========
@include respond-to('tablet') {
  .footer-inner {
    width: 100%;
  }

  // 服务保障：平板改为 2 列
  .footer-service .footer-inner {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  // 帮助中心链接：平板改为 2 列
  .footer-links .footer-inner {
    flex-wrap: wrap;
    gap: 30px;
  }
}

@include respond-to('mobile') {
  .footer-inner {
    width: 100%;
    padding: 0 12px;
  }

  // 服务保障改为 2 列
  .footer-service .footer-inner {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .footer-service .service-item {
    justify-content: flex-start;
  }

  // 帮助中心链接改为 2 列
  .footer-links {
    padding: 24px 0 20px;

    .footer-inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .link-column {
      h4 {
        font-size: 14px;
        margin-bottom: 10px;
      }
    }

    .contact-column {
      grid-column: 1 / -1;
    }
  }

  // 隐藏二维码
  .qr-codes {
    display: none;
  }

  .footer-bottom {
    padding: 14px 0;

    p {
      font-size: 11px;
      line-height: 1.6;
    }
  }
}
</style>
