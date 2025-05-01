"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import ReactMarkdown from 'react-markdown'
import { Components } from 'react-markdown'

// 为表格添加自定义组件
const CustomTable: Components['table'] = ({ node, ...props }) => {
  return (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg" {...props} />
    </div>
  )
}

const CustomTableHead: Components['thead'] = (props) => {
  return <thead className="bg-gray-100" {...props} />
}

const CustomTableBody: Components['tbody'] = (props) => {
  return <tbody {...props} />
}

const CustomTableRow: Components['tr'] = (props) => {
  return <tr className="border-b border-gray-300 hover:bg-gray-50" {...props} />
}

const CustomTableCell: Components['td'] = (props) => {
  return <td className="py-3 px-4 text-left border-r border-gray-300 last:border-r-0" {...props} />
}

const CustomTableHeader: Components['th'] = (props) => {
  return <th className="py-3 px-4 text-left font-semibold border-r border-gray-300 last:border-r-0" {...props} />
}

// 定义博客内容的类型（支持Markdown）
interface BlogPost {
  title: string;
  category: string;
  date: string;
  author: string;
  authorTitle: string;
  content: string; // Markdown内容
  comparisonSection?: {
    title: string;
    headers: string[];
    rows: { name: string; cyanix: string; traditional: string }[];
  }; // 对比表格特殊处理
}

// 定义博客数据集合的类型（带索引签名）
interface BlogDataCollection {
  [key: string]: BlogPost;
}

// 模拟博客数据
const blogData: BlogDataCollection = {
  "ai-reshaping-customer-service": {
    title: "AI如何重塑客户服务体验的未来",
    category: "行业洞察",
    date: "2025-05-01",
    author: "woo",
    authorTitle: "解决方案团队",
    content: `
## AI已成为企业必选题：挑战与机遇

AI已成为各个企业必选题，但要成为组织变革仍有不少挑战与阻碍，急需一个最佳实践的场景来为战略落地提供支柱，助力企业加速数字化转型。

我们建议您将目光优先关注在与客户联络场景，因为企业的本质是创造客户，满足客户，客户的声音是关键的源头，过往我们通过专业把客户联络场景分到研发、销售、市场、售后等，虽管理更为明确，但也形成数据孤岛，客户价值数据使用率低，业务交付效率低，客户终身价值有限等问题。而客户数据是企业经营最重要的资产，值得任何企业最大力度的投资重视起来，而不应该仅交给客服或售后等部门，应该由一把手带上CIO一起来构建。

## 中国制造业面临的障碍

但这个场景的落地对于中国制造业来说仍有这些阻碍：

1. 数据分散、碎片，转化成业务系统的成本高
2. 企业信息化建设能力不一，业务流程标准化程度不同，有些数据还使用手写文档，知识库建设成本高
3. 数据安全方案不同
4. 数据洞察与经营理念相对落后

## 青鸟助力客户联络价值重塑：从数据孤岛到增长飞轮的完整闭环

基于企业数字化转型痛点和客户联络场景的战略价值，青鸟CXaaS围绕数据资产化、知识敏捷化、业务自主化、价值显性化四大目标，重构客户联络中心的商业逻辑，打造企业级客户价值运营中枢。

### 1. 全渠道客户声音管理平台：终结数据碎片化，构建企业级客户数据资产池

**核心功能**  
- **全渠道数据无损耗整合**：  
  - 自动抓取微信（个人/企业微信）、电话、网页表单、邮件、社交媒体等全渠道客户交互数据，支持语音、文字、图片、视频多模态数据原生入库，无需人工结构化。  
  - 企业微信多对多私域管理：1个"好友"号可同时管理多个客户（传统1V1模式需多人值守，微信客服不在好友里），支持群消息自动分流、敏感词监控、高频问题AI预响应，私域运营人力成本降低60%。  
- **AI全量接管+人工辅助模式**：  
  - 简单咨询（如订单查询、产品参数）由AI 7×24小时全量处理，复杂问题（如投诉、技术故障）自动转人工并推送关联数据（历史工单、产品手册），实现"零等待"服务体验。  

**差异化优势**  
- **轻量化数据治理**：通过NLP自动提取客户意图关键词（如"退货""安装失败"），非结构化数据转化为可分析标签，数据分析效率提升50%。  
- **数据资产安全性**：客户交互数据加密存储，支持离职员工账号权限一键回收，防止客户资源流失（传统销售离职导致微信客户丢失率超30%）。  

**案例**：某消费电子品牌接入后，企业微信私域群管理效率提升3倍，客户响应速度从5分钟缩短至10秒，数据利用率从20%提升至85%。

### 2. 企业知识运营引擎：从"散装知识"到"智能资产"的零门槛转化

**核心功能**  
- **AI辅助知识冷启动**：  
  - 支持Excel、PDF、会议纪要、对话记录等多格式生产资料一键导入，AI自动清洗、去重、结构化，冷启动时间从1周压缩至1天，训练数据量需求减少50%。  
  - 行业专属MOE小模型：基于混合专家模型（Mixture of Experts），针对新能源、ICT、消费品等行业定制知识推理逻辑，问答准确率提升至90%（行业平均80%）。  
- **动态知识更新**：  
  - 与企业内部系统（ERP、PLM）实时对接，产品参数变更、售后政策更新自动同步至知识库，避免"过期知识误导客户"。  

**差异化优势**  
- **OCR精准识别**：图片/PDF文档关键信息（如产品序列号、合同条款）识别准确率99.5%，超越行业平均97%。  
- **多语言知识自适应**：支持中英日等12种语言知识库自动对齐，助力企业出海场景（传统方案需多语言独立配置）。  

**案例**：某新能源车企通过MOE模型冷启动知识库，售后问题解决率从65%跃升至92%，培训周期缩短70%。

### 3. 零代码服务设计平台：业务部门主导的敏捷创新工场

**核心功能**  
- **自然语言转业务流程（NL2Flow）**：  
  - 业务人员用自然语言描述需求（如"客户退货需验证订单号、物流单号、商品状态"），AI自动生成可执行服务流程，并关联知识库与后端系统（如ERP退款接口）。  
  - 高频VOC自动分析：从客户对话中提取TOP10高频问题，推荐优化策略（如"43%客户咨询安装问题→生成视频教程并推送至知识库"）。  
- **服务生态共建平台**：  
  - 企业可发布自研服务流程至行业生态库（如"家电维修预约流程"），其他企业付费调用或二次优化，形成"设计-共享-收益"闭环。  

**差异化优势**  
- **业务流搭建效率**：传统需2周开发的流程，零代码平台1天上线，IT资源投入减少80%。  
- **并发处理能力**：单节点支持1000+咨询/秒（行业平均500），满足电商大促、新品发布等高并发场景。  

**案例**：某零售品牌通过平台搭建"促销活动咨询"流程，上线周期从10天缩短至4小时，活动期间AI拦截率95%，客服人力节省75%。

### 4. 客户价值运营模型：从服务数据到商业决策的直通车

**核心功能**  
- **经营模型与问数能力**：  
  - 内置客户生命周期模型（CLV预测）、产品缺陷归因模型，自动输出可执行建议（如"TOP3客户流失原因：响应延迟占比38%"）。  
  - 价值转化看板：实时展示服务数据与业务指标关联性（如"客服满意度提升1分→复购率增加0.5%"），驱动管理层决策。  
- **AI驱动商机挖掘**：  
  - 从对话记录中提取潜在需求（如"客户多次询问企业级路由器→推送B端销售线索"），商机转化率提升30%。  

**差异化优势**  
- **自有数据洞察报告**：自动生成《客户体验健康度报告》《产品改进优先级清单》，减少第三方咨询依赖（传统方案需额外采购BI工具）。  
- **合规数据应用**：支持匿名化处理敏感信息（如客户手机号），满足GDPR/等保三级要求。  

**案例**：某ICT企业通过系统识别"某设备固件升级需求集中"，推动研发部门优化版本，产品投诉率下降25%，年度运维成本减少1200万元。
    `,
    // 单独处理核心对比表格，以解决格式问题
    comparisonSection: {
      title: "与传统方案的核心差异对比",
      headers: ["维度", "青鸟CXaaS", "传统方案/竞品"],
      rows: [
        { 
          name: "数据整合", 
          cyanix: "全渠道原生入库，无需结构化", 
          traditional: "依赖人工清洗，仅支持标准化数据" 
        },
        { 
          name: "知识冷启动", 
          cyanix: "1天完成，MOE模型提升行业适配性", 
          traditional: "1周以上，通用模型长尾场景覆盖不足" 
        },
        { 
          name: "私域运营", 
          cyanix: "企业微信多对多，1人管理10+群", 
          traditional: "1V1模式，人力成本高且响应延迟" 
        },
        { 
          name: "服务模式", 
          cyanix: "AI全量接管+人工兜底，零等待体验", 
          traditional: "人工座席为主，排队导致客户流失" 
        },
        { 
          name: "价值转化", 
          cyanix: "自动输出可执行洞察报告，驱动业务决策", 
          traditional: "数据与分析分离，依赖第三方BI工具" 
        }
      ]
    }
  }
}

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      // 模拟从API获取数据
      setTimeout(() => {
        setPost(blogData[slug] || null)
        setLoading(false)
      }, 500)
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-10"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold mb-4">博客文章未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，您请求的博客文章不存在或已被移除。</p>
          <Link href="/blog" className="btn-tertiary">
            返回博客列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-primary font-medium flex items-center hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" /> 返回首页
          </Link>
        </div>

        <article>
          <header className="mb-8">
            <div className="text-sm text-primary font-medium mb-2">{post.category}</div>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.author}，{post.authorTitle}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown components={{
              table: CustomTable,
              thead: CustomTableHead,
              tbody: CustomTableBody,
              tr: CustomTableRow,
              th: CustomTableHeader,
              td: CustomTableCell,
            }}>
              {post.content}
            </ReactMarkdown>

            {/* 使用自定义组件渲染对比表格 */}
            {post.comparisonSection && (
              <div className="mt-10 mb-10">
                <h2 className="text-2xl font-semibold mb-6">{post.comparisonSection.title}</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr className="border-b border-gray-300">
                        {post.comparisonSection.headers.map((header, index) => (
                          <th key={index} className="py-3 px-4 text-left font-semibold border-r border-gray-300 last:border-r-0">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {post.comparisonSection.rows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                          <td className="py-3 px-4 text-left font-medium border-r border-gray-300">{row.name}</td>
                          <td className="py-3 px-4 text-left border-r border-gray-300">{row.cyanix}</td>
                          <td className="py-3 px-4 text-left">{row.traditional}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 添加总结部分 */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">总结</h2>
              <p className="mb-4 text-gray-700">
                青鸟CXaaS通过 全渠道数据资产化、知识敏捷运营、业务自主创新、价值显性驱动的完整闭环，
                解决了企业客户联络场景的三大核心矛盾——数据孤岛、响应滞后、价值断层。其差异化优势不仅体现在
                技术参数（冷启动1天、准确率90%），更在于让业务部门成为数字化转型的主导者，真正实现"客户声音驱动增长"。
              </p>
            </div>
          </div>
        </article>

        <div className="mt-12 pt-8 border-t">
          <Link href="/" className="btn-tertiary inline-block">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 