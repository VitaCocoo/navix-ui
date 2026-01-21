/**
 * 模拟数据文件
 * 包含所有静态模拟数据：指标、任务、热词、舆情、案例、消息等
 */

// 指标数据
const metricsData = [
    { title: '客流量', value: '1,250人', changeAbs: '+50人', changeRel: '+4.2%', isUp: true },
    { title: '工牌使用率', value: '85%', changeAbs: '+5%', changeRel: '+6.2%', isUp: true },
    { title: '平均时长', value: '7.2h', changeAbs: '-0.5h', changeRel: '-6.5%', isUp: false },
];

// 首次使用欢迎消息（仅首次显示）
const welcomeMessage = {
    id: 'welcome_msg',
    type: 'greeting',
    typeLabel: '👋欢迎使用',
    typeColor: 'info',
    title: '您好！我是您的智能经营助手',
    content: `我能为您做什么：

📊 每日6:00推送昨日经营重点
• 自动筛选最需要关注的3条消息
• 高风险会话、数据异动、优秀案例一目了然

🎯 智能监督任务管理
• AI自动判断店员是否按要求服务
• 发现问题立即提醒，优秀案例及时表扬

💡 数据洞察与决策支持
• 客流量、工牌使用率等核心指标
• 门店排名、趋势分析帮您快速决策

从明天开始，我会每天早上6点为您播报昨日重要情况。

💡 使用提示：
点击底部的快捷工具按钮，我会立即为您展示对应的内容。
虽然暂时还不支持自由对话，但我会尽力为您提供最有价值的信息。`,
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    date: new Date().toISOString().slice(0, 10),
    priority: 0,
    hasChart: false,
    hasDetail: false,
    hasCreateTask: false
};

// AI消息推送数据（每日8:00推送最重要的3条消息）
const aiMessages = [
    {
        id: 'msg_001',
        type: 'risk',
        typeLabel: '⚠️紧急风险',
        typeColor: 'error',
        title: '禁忌症未询问风险提醒',
        summary: '• 昨日检测到3起高风险会话\n• 涉及阿司匹林销售时未询问禁忌症\n• 可能导致严重的用药安全问题',
        time: '2026-01-14 08:00',
        date: '2026-01-14',
        priority: 1,
        hasChart: false,
        hasDetail: true,
        hasCreateTask: true,
        createdTaskId: null,  // 如果已基于该消息创建任务，则存储任务ID；否则为null
        detailType: 'session', // 跳转类型：session/metric/task
        relatedData: {
            sessionId: 'session_001',  // 跳转到第一个高风险会话详情
            sessionIds: ['session_001', 'session_003', 'session_004'],
            riskLevel: 'high'
        }
    },
    {
        id: 'msg_002',
        type: 'data-change',
        typeLabel: '📊数据异动',
        typeColor: 'warning',
        title: '客流量异常下降34%',
        summary: '• 昨日客流量1,250人，较前日下降34%\n• 连续3天下降趋势\n• 建议关注门店周边环境变化',
        time: '2026-01-14 08:00',
        date: '2026-01-14',
        priority: 2,
        hasChart: true,
        chartData: {
            labels: ['01-08', '01-09', '01-10', '01-11', '01-12', '01-13', '01-14'],
            values: [1890, 1850, 1780, 1650, 1520, 1380, 1250]
        },
        hasDetail: true,
        hasCreateTask: false,
        detailType: 'metric',
        relatedData: {
            metricName: '客流量',
            changePercent: -34,
            currentValue: 1250,
            previousValue: 1890,
            // AI分析和AI建议（仅从消息进入指标详情页时显示）
            aiAnalysis: '根据数据分析，昨日客流量大幅下降主要有以下原因：\n\n1. 周边新开了一家连锁药店，距离广州店仅200米，造成客流分流\n2. 昨日为工作日周三，相比周末客流自然下降\n3. 深圳店所在区域正在进行道路施工，影响顾客到店\n4. 天气因素：昨日多地降雨，影响顾客外出购药',
            aiSuggestions: [
                '建议在广州店加大促销力度，推出会员专属优惠吸引客流',
                '深圳店可在施工结束前增加外卖配送服务，减少客流影响',
                '创建"客流维护监督任务"，跟踪各门店客流恢复情况',
                '分析竞争对手定价策略，适时调整价格保持竞争力'
            ]
        }
    },
    {
        id: 'msg_003',
        type: 'excellent',
        typeLabel: '🌟优秀案例',
        typeColor: 'success',
        title: '张小丽专业服务获好评',
        summary: '• 专业解答过敏性鼻炎用药咨询\n• 主动推荐关联产品，客单价提升40%\n• 顾客主动表扬服务态度',
        time: '2026-01-14 08:00',
        date: '2026-01-14',
        priority: 3,
        hasChart: false,
        hasDetail: true,
        hasCreateTask: false,
        detailType: 'session',
        relatedData: {
            sessionId: 'session_002',  // 对应感冒药专业咨询案例
            staffName: '张小丽',
            storeName: '中心广场店'
        }
    }
];

// 历史消息数据（按日期分组）
const historicalMessages = [
    {
        date: '2026-01-14',
        dateLabel: '今天',
        messages: aiMessages
    },
    {
        date: '2026-01-13',
        dateLabel: '昨天',
        messages: [
            {
                id: 'msg_004',
                type: 'suggestion',
                typeLabel: '💡改进建议',
                typeColor: 'info',
                title: '建议加强会员权益宣传',
                summary: '• 会员权益告知率仅42%\n• 大量会员未知道双倍积分活动\n• 建议在收银台增加提示海报',
                time: '2026-01-13 08:00',
                date: '2026-01-13',
                priority: 2,
                hasChart: false,
                hasDetail: true,
                hasCreateTask: true,
                detailType: 'task',
                relatedData: {
                    taskId: 2
                }
            }
        ]
    }
];

// 会话列表数据（新增）
const sessionsData = [
    {
        id: 'session_001',
        title: '阿司匹林快速销售',
        time: '2026-01-13 14:35',
        duration: '2分15秒',
        staff: {
            name: '李明',
            id: 'staff_001',
            avatar: 'https://i.pravatar.cc/150?u=staff001'
        },
        store: '中心广场店',
        riskLevel: 'high',
        riskLabel: '高风险',
        tags: ['禁忌症未询问', '阿司匹林销售', '用药安全'],
        summary: 'AI检测到店员在销售阿司匹林时未询问顾客是否有胃溃疡等禁忌症，存在严重的用药安全风险。',
        suggestions: [
            '建议店员主动询问顾客是否有胃部疾病史、出血倾向等禁忌症，降低用药风险',
            '对阿司匹林等高风险药品增加禁忌症确认环节，建立标准话术',
            '加强店员培训，提升用药安全意识和服务专业度'
        ],
        hasCreateTask: true,  // 支持创建监督任务
        createdTaskId: null,  // 尚未创建任务
        transcript: [
            { role: 'customer', text: '你好，有阿司匹林吗？', time: '14:35:10' },
            { role: 'staff', text: '有的，这边请。', time: '14:35:15' },
            { role: 'customer', text: '多少钱一盒？', time: '14:35:20' },
            { role: 'staff', text: '12块8。', time: '14:35:22', highlight: true, highlightReason: '未询问禁忌症' },
            { role: 'customer', text: '好的，给我来一盒。', time: '14:35:25' },
            { role: 'staff', text: '好的，12块8。', time: '14:35:28' }
        ],
        taskResults: [
            {
                taskId: 1,
                taskName: '阿司匹林禁忌症询问',
                matched: true,
                achieved: false,
                reason: '店员未询问顾客是否有胃溃疡、出血倾向等禁忌症',
                evidence: '全程对话未提及任何用药禁忌相关问题'
            }
        ]
    },
    {
        id: 'session_002',
        title: '感冒药专业咨询与关联销售',
        time: '2026-01-13 10:22',
        duration: '5分38秒',
        staff: {
            name: '张小丽',
            id: 'staff_002',
            avatar: 'https://i.pravatar.cc/150?u=staff002'
        },
        store: '中心广场店',
        riskLevel: 'low',
        riskLabel: '低风险',
        tags: ['专业服务', '关联销售', '优秀案例'],
        summary: '店员专业解答顾客咨询，主动推荐维生素C增强免疫力，服务态度优秀，获得顾客认可。',
        suggestions: [
            '建议将此案例作为标准服务流程示范，在团队内部分享推广',
            '可考虑将"症状询问-专业推荐-关联销售"模式固化为服务话术'
        ],
        hasCreateTask: false,  // 优秀案例，不需要创建监督任务
        transcript: [
            { role: 'customer', text: '你好，我有点感冒流鼻涕，推荐什么药？', time: '10:22:10' },
            { role: 'staff', text: '您好！请问还有发烧、咳嗽这些症状吗？', time: '10:22:15' },
            { role: 'customer', text: '没有发烧，就是流鼻涕，打喷嚏。', time: '10:22:20' },
            { role: 'staff', text: '那我建议您吃感冒灵颗粒，专门针对流涕、打喷嚏效果很好。另外最近流感高发，建议您搭配维生素C增强抵抗力。', time: '10:22:28', highlight: true, highlightReason: '主动关联推荐' },
            { role: 'customer', text: '好的，那就按你说的来吧。', time: '10:22:35' },
            { role: 'staff', text: '好的，感冒灵一盒28元，维C一瓶32元，一共60元。记得多喝水多休息哦。', time: '10:22:42' }
        ],
        taskResults: [
            {
                taskId: 1,
                taskName: '流感关联维C',
                matched: true,
                achieved: true,
                reason: '店员主动推荐维生素C增强免疫力',
                evidence: '对话中提到"搭配维生素C增强抵抗力"'
            }
        ]
    },
    {
        id: 'session_003',
        title: '布洛芬销售缺乏禁忌症询问',
        time: '2026-01-13 16:20',
        duration: '1分48秒',
        staff: {
            name: '赵敏',
            id: 'staff_003',
            avatar: 'https://i.pravatar.cc/150?u=staff003'
        },
        store: '万达广场店',
        riskLevel: 'high',
        riskLabel: '高风险',
        tags: ['禁忌症未询问', '布洛芬销售', '用药安全'],
        summary: '顾客购买布洛芬时，店员直接完成销售，未询问顾客是否有胃肠道疾病、哮喘史等禁忌症，存在用药安全隐患。',
        suggestions: [
            '布洛芬属于非甾体抗炎药，必须询问顾客是否有胃肠道疾病或哮喘史',
            '建议对解热镇痛类药品销售制定统一的安全询问流程',
            '加强赵敏的药品安全培训，重点关注常用药品的禁忌症'
        ],
        hasCreateTask: true,  // 支持创建监督任务
        createdTaskId: null,  // 尚未创建任务
        transcript: [
            { role: 'customer', text: '给我拿一盒布洛芬。', time: '16:20:05' },
            { role: 'staff', text: '好的，18元。', time: '16:20:08', highlight: true, highlightReason: '未询问禁忌症' },
            { role: 'customer', text: '扫这个码。', time: '16:20:12' },
            { role: 'staff', text: '好的，已收款。', time: '16:20:15' }
        ],
        taskResults: [
            {
                taskId: 1,
                taskName: '非甾体抗炎药禁忌症询问',
                matched: true,
                achieved: false,
                reason: '店员未询问顾客是否有胃肠道疾病、哮喘史等禁忌症',
                evidence: '全程对话未提及任何用药禁忌相关问题'
            }
        ]
    },
    {
        id: 'session_004',
        title: '头孢类抗生素过敏史未询问',
        time: '2026-01-13 11:15',
        duration: '2分05秒',
        staff: {
            name: '李强',
            id: 'staff_004',
            avatar: 'https://i.pravatar.cc/150?u=staff004'
        },
        store: '滨江路分店',
        riskLevel: 'high',
        riskLabel: '高风险',
        tags: ['过敏史未询问', '头孢销售', '合规风险'],
        summary: '店员在销售头孢类抗生素时，未按规范询问顾客是否有青霉素过敏史，违反《药品经营质量管理规范》，存在严重用药安全风险。',
        suggestions: [
            '头孢类抗生素存在交叉过敏风险，必须询问青霉素过敏史',
            '建议在抗生素货架张贴醒目提示，提醒店员必须询问过敏史',
            '对李强进行重点培训，强化抗生素类药品的合规销售意识'
        ],
        transcript: [
            { role: 'customer', text: '给我拿盒头孢。', time: '11:15:05' },
            { role: 'staff', text: '这个效果好，89块。', time: '11:15:10', highlight: true, highlightReason: '未询问过敏史' },
            { role: 'customer', text: '行，微信付。', time: '11:15:15' },
            { role: 'staff', text: '好的。', time: '11:15:18' }
        ],
        taskResults: [
            {
                taskId: 1,
                taskName: '抗生素过敏史询问',
                matched: true,
                achieved: false,
                reason: '店员未询问顾客是否有青霉素过敏史',
                evidence: '全程对话未提及过敏史相关问题'
            }
        ]
    }
];

// 任务数据
const supervisionTasks = [
    { id: 1, title: '流感关联维C', desc: '买感冒药时推荐维生素C', value: '68%', changeRel: '+12%', isUp: true, createTime: '2026-01-10' },
    { id: 2, title: '会员日双倍积分', desc: '结账时提醒会员权益', value: '92%', changeRel: '+5%', isUp: true, createTime: '2026-01-11' },
    { id: 3, title: '新品益生菌', desc: '抗生素关联益生菌', value: '45%', changeRel: '-8%', isUp: false, createTime: '2026-01-12' },
];

// 热词数据
const hotWords = [
    { rank: 1, text: '感冒灵', type: '药品', count: 324, status: 'up' },
    { rank: 2, text: '布洛芬', type: '药品', count: 289, status: 'stable' },
    { rank: 3, text: '咳嗽', type: '症状', count: 210, status: 'down' },
    { rank: 4, text: '流感', type: '症状', count: 188, status: 'new' },
    { rank: 5, text: '会员日', type: '活动', count: 156, status: 'up' },
];

// 舆情数据
const sentimentData = [
    {
        id: 's1',
        type: 'complaint',
        typeText: '投诉',
        priority: 'high',
        priorityIcon: '🔥',
        title: '顾客投诉店员态度冷漠',
        time: '2026-01-13 14:35',
        store: '中心广场店',
        staff: {
            name: '张晓敏',
            avatar: 'https://i.pravatar.cc/150?u=staff1'
        },
        summary: '顾客咨询儿童感冒药用法用量时，店员张晓敏回答简短且语气不耐烦，顾客多次追问仍未获得满意答复。顾客情绪激动，表示要投诉到药监局。最终顾客未购买商品离店，并在门口与其他顾客抱怨此次经历，造成不良影响。',
        riskLevel: 'high',
        aiInsight: '店员回答敷衍、态度冷淡，导致顾客情绪激动。儿童用药咨询需要更专业耐心的服务。',
        aiSolution: '店长致电致歉并赠送50元代金券；对张晓敏进行"儿童用药咨询话术"专项培训。',
        transcript: [
            { role: 'user', text: '你好，我想问一下这个小儿感冒药，三岁孩子怎么吃？', time: '14:35:10' },
            { role: 'staff', text: '说明书上写着呢。', time: '14:35:15', highlight: true, note: '回答敷衍' },
            { role: 'user', text: '我知道说明书，但是我想问得详细一点，比如饭前还是饭后...', time: '14:35:22' },
            { role: 'staff', text: '都行。', time: '14:35:26', highlight: true, note: '态度冷淡' },
            { role: 'user', text: '你这什么态度啊！我要投诉你！', time: '14:35:35', highlight: true, note: '顾客情绪激动' }
        ],
        actionSuggest: '建议店长立即致电顾客致歉，说明员工状态不佳的原因，并提供50元代金券作为补偿。同时对张晓敏进行谈话提醒。',
        trainingSuggest: '该员工需加强服务意识培训，特别是顾客咨询场景下的耐心沟通技巧。建议安排"儿童用药常见问题应答"专项培训。'
    },
    {
        id: 's2',
        type: 'dispute',
        typeText: '纠纷',
        priority: 'high',
        priorityIcon: '💥',
        title: '顾客与店员发生激烈争吵',
        time: '2026-01-13 11:20',
        store: '万达广场店',
        staff: {
            name: '赵敏',
            avatar: 'https://i.pravatar.cc/150?u=staff5'
        },
        summary: '顾客认为购买的钙片无效要求退货，店员赵敏告知已开封不能退。顾客情绪激动，指责店员欺骗消费者。双方发生激烈争吵，引发多名顾客围观。最终店长介入，同意换货并赔礼道歉才平息事态。',
        riskLevel: 'high',
        transcript: [
            { role: 'user', text: '我买的这个钙片吃了半个月，一点用都没有，你们给我退了！', time: '11:20:05' },
            { role: 'staff', text: '您好，这个已经开封了，按规定不能退货的。', time: '11:20:12' },
            { role: 'user', text: '什么规定？你们当时就说有效，现在没效你们就不管了是吧？', time: '11:20:20', highlight: true, note: '顾客情绪激动' },
            { role: 'staff', text: '大姐您别激动，保健品需要长期服用才有效果...', time: '11:20:28' },
            { role: 'user', text: '你说谁大姐呢？我看你们就是骗人的黑店！', time: '11:20:35', highlight: true, note: '冲突升级' }
        ],
        actionSuggest: '立即向顾客致歉，说明退换货政策，必要时破例处理以平息纠纷。对店员进行冲突处理技巧培训，强调遇到情绪激动顾客时应立即请店长介入。',
        trainingSuggest: '全员培训"顾客投诉与纠纷处理规范"，学习降级技巧，避免语言冲突。建议设置"顾客权益保障专员"角色。'
    },
    {
        id: 's3',
        type: 'stock-out',
        typeText: '商品缺货',
        priority: 'medium',
        priorityIcon: '📦',
        title: '连花清瘟缺货导致顾客流失',
        time: '2026-01-13 09:15',
        store: '火车站店',
        staff: {
            name: '李娟',
            avatar: 'https://i.pravatar.cc/150?u=staff6'
        },
        summary: '流感高发期，顾客点名要买连花清瘟胶囊，但门店已断货3天。店员推荐替代品被顾客拒绝，顾客表示"那我去隔壁买"后离店。当天该门店记录到8次类似缺货情况，造成销售机会损失。',
        riskLevel: 'medium',
        transcript: [
            { role: 'user', text: '有连花清瘟吗？', time: '09:15:05' },
            { role: 'staff', text: '不好意思，这个暂时没货了。您看要不试试感冒灵？效果也很好。', time: '09:15:12', highlight: true, note: '推荐替代品' },
            { role: 'user', text: '不要，我就要连花清瘟。那我去隔壁看看吧。', time: '09:15:20', highlight: true, note: '顾客流失' }
        ],
        actionSuggest: '立即联系供应商补货，并在门店入口处张贴"连花清瘟补货中"告示。统计近期热销药品缺货频次，优化库存预警机制。',
        trainingSuggest: '培训店员在缺货场景下的应对话术，学习如何有效推荐替代品，提升转化率。'
    },
    {
        id: 's4',
        type: 'quality-issue',
        typeText: '质量问题',
        priority: 'high',
        priorityIcon: '⚠️',
        title: '顾客反映药品包装破损',
        time: '2026-01-13 13:40',
        store: '南门店',
        staff: {
            name: '周杰',
            avatar: 'https://i.pravatar.cc/150?u=staff7'
        },
        summary: '顾客购买某品牌维生素后发现包装盒有破损，瓶盖松动。店员周杰立即为顾客更换新品并致歉。经核查，该批次商品在运输过程中受损，门店已将剩余库存下架，并向供应商反馈质量问题。',
        riskLevel: 'high',
        transcript: [
            { role: 'user', text: '你好，我刚买的这个维生素，包装盒都破了，瓶盖也松的。', time: '13:40:05', highlight: true, note: '质量问题' },
            { role: 'staff', text: '真的很抱歉！我马上给您换一瓶新的，您稍等。', time: '13:40:12' },
            { role: 'staff', text: '给您换好了，这瓶是完好的。给您带来不便真的很抱歉。', time: '13:40:35' },
            { role: 'user', text: '好的，谢谢。', time: '13:40:40' }
        ],
        actionSuggest: '立即对该批次商品进行全面检查，问题商品下架处理。联系供应商核实质量问题原因，必要时启动退货流程。',
        trainingSuggest: '加强收货验收环节培训，要求员工对每批新货进行外观检查，发现包装破损及时记录并隔离。'
    },
    {
        id: 's5',
        type: 'price-dispute',
        typeText: '价格争议',
        priority: 'medium',
        priorityIcon: '💰',
        title: '顾客质疑价格比网上贵',
        time: '2026-01-13 15:50',
        store: '解放路店',
        staff: {
            name: '孙丽',
            avatar: 'https://i.pravatar.cc/150?u=staff8'
        },
        summary: '顾客购买某保健品时用手机查询发现网购价格便宜30元，质疑门店价格虚高。店员孙丽解释实体店有房租、人工等成本，并强调可以提供专业用药咨询服务。顾客表示理解但仍未购买。',
        riskLevel: 'low',
        transcript: [
            { role: 'user', text: '这个蛋白粉多少钱？', time: '15:50:05' },
            { role: 'staff', text: '268元。', time: '15:50:08' },
            { role: 'user', text: '我看网上才238，你们这怎么贵这么多？', time: '15:50:15', highlight: true, note: '价格质疑' },
            { role: 'staff', text: '网上是便宜一点，但我们实体店可以现场为您讲解服用方法，有问题随时来咨询。', time: '15:50:25' },
            { role: 'user', text: '那我还是网上买吧，便宜点。', time: '15:50:35' }
        ],
        actionSuggest: '分析该商品定价策略，评估是否需要调整。可推出"线上价格匹配"或"会员专享价"等促销活动，提升竞争力。',
        trainingSuggest: '培训店员应对价格质疑的话术，强调实体店的增值服务（专业咨询、快速取药、售后保障）。'
    },
    {
        id: 's6',
        type: 'service-risk',
        typeText: '服务风险',
        priority: 'high',
        priorityIcon: '🚨',
        title: '店员推荐药品时未询问过敏史',
        time: '2026-01-13 16:20',
        store: '滨江路分店',
        staff: {
            name: '李强',
            avatar: 'https://i.pravatar.cc/150?u=staff2'
        },
        summary: '顾客购买头孢类抗生素时，店员李强直接推荐并收银，全程未询问顾客是否有青霉素过敏史。虽然顾客本次未发生不良反应，但此操作违反《药品经营质量管理规范》，存在重大用药安全隐患。',
        riskLevel: 'high',
        transcript: [
            { role: 'user', text: '给我拿盒头孢。', time: '16:20:05' },
            { role: 'staff', text: '这个效果好，89块。', time: '16:20:10', highlight: true, note: '未询问过敏史' },
            { role: 'user', text: '行，微信付。', time: '16:20:15' }
        ],
        actionSuggest: '立即通知该店长加强合规培训，要求所有员工在销售处方药或抗生素时，必须询问过敏史并登记。建议对该员工进行书面警告。',
        trainingSuggest: '全员进行"抗生素销售规范流程"复训，考核合格后方可上岗。重点强调过敏史询问环节的法律风险。'
    },
    {
        id: 's7',
        type: 'store-anomaly',
        typeText: '门店异常',
        priority: 'medium',
        priorityIcon: '🔧',
        title: '门店空调故障影响顾客体验',
        time: '2026-01-13 12:30',
        store: 'CBD店',
        staff: {
            name: '陈涛',
            avatar: 'https://i.pravatar.cc/150?u=staff9'
        },
        summary: '门店中央空调突然故障，室内温度升高，多名顾客抱怨闷热。店员陈涛及时联系物业维修，并为等待的顾客提供免费饮用水。维修耗时2小时，期间部分顾客提前离店。',
        riskLevel: 'medium',
        transcript: [
            { role: 'user', text: '你们店里怎么这么热啊？', time: '12:30:05' },
            { role: 'staff', text: '真的很抱歉，空调刚才突然坏了，我们已经在联系维修了。', time: '12:30:12' },
            { role: 'staff', text: '您要不先喝点水？我给您倒。', time: '12:30:20', highlight: true, note: '贴心服务' },
            { role: 'user', text: '算了，我先走了，太热了。', time: '12:30:28', highlight: true, note: '顾客流失' }
        ],
        actionSuggest: '加强设施设备定期维护，建立应急预案。遇到突发故障时，及时告知顾客并提供补偿措施（如临时降价、发放代金券）。',
        trainingSuggest: '培训店员应对突发设施故障的应急话术和服务补救措施，减少顾客流失。'
    },
    {
        id: 's8',
        type: 'praise',
        typeText: '好评',
        priority: 'low',
        priorityIcon: '👍',
        title: '顾客当面表扬店员服务细心',
        time: '2026-01-13 10:45',
        store: '体育馆店',
        staff: {
            name: '王芳',
            avatar: 'https://i.pravatar.cc/150?u=staff3'
        },
        summary: '顾客为老人购买降压药时，店员王芳主动询问老人是否有其他基础疾病，提醒药物禁忌，并详细讲解服用时间和注意事项。顾客非常满意，当场表示"你们这个小姑娘真专业，比医院的都讲得清楚"。',
        riskLevel: 'low',
        transcript: [
            { role: 'user', text: '帮我买盒降压药。', time: '10:45:05' },
            { role: 'staff', text: '好的，老人家有没有糖尿病或者肾脏方面的问题呢？', time: '10:45:12', highlight: true, note: '主动询问病史' },
            { role: 'user', text: '没有，就是血压有点高。', time: '10:45:20' },
            { role: 'staff', text: '那这个可以。每天早上一片，空腹吃效果最好。另外提醒一下，吃这个药期间不要吃西柚，会影响药效。', time: '10:45:28', highlight: true, note: '贴心提醒' },
            { role: 'user', text: '你们这个小姑娘真专业，谢谢啊！', time: '10:45:40' }
        ],
        actionSuggest: '建议将王芳的服务案例作为培训素材，在全公司推广。可给予月度"金牌店员"称号或物质奖励。',
        trainingSuggest: '提取王芳的服务话术，制作成"老年人用药服务标准流程"，供其他员工学习。'
    }
];

// 案例数据
const casesData = [
    { 
        id: 'c1', 
        name: '李晓红', 
        store: '中心广场店', 
        tag: '教科书式挽留', 
        reason: '在顾客明确表示"嫌贵"拒绝后，店员没有降价，而是巧妙使用了"平摊成本法"（一天才几毛钱），成功打消顾客顾虑，完成高客单价转化。',
        duration: '5分12秒',
        startTime: '今日 10:30',
        transcript: [
            { role: 'staff', text: '姐，这款胶原蛋白肽现在活动很划算，买三送一。', time: '10:30:15' },
            { role: 'user', text: '哎哟，太贵了，三百多块钱呢，不买了。', time: '10:30:22' },
            { role: 'staff', text: '姐，乍一听是挺贵。但您算笔账，一套能吃两个月。', highlight: true, note: '拆解成本', time: '10:30:28' },
            { role: 'staff', text: '平摊下来每天不到5块钱，也就一杯奶茶钱。奶茶喝了长胖，这个喝了能让皮肤变亮，多值呀！', highlight: true, note: '价值锚定', time: '10:30:45' },
            { role: 'user', text: '呵呵，你这小姑娘真会说话。那行吧，来一套。', time: '10:31:05' }
        ]
    },
    { 
        id: 'c2', 
        name: '王强', 
        store: '滨江路分店', 
        tag: '高情商回复', 
        reason: '面对顾客对药效的质疑，没有直接反驳，而是通过"共情+专业背书"的方式建立信任，体现了极高的服务水准。',
        duration: '3分45秒',
        startTime: '今日 14:15',
        transcript: [
            { role: 'user', text: '你们这药是不是假的啊？吃了两天没一点用。', time: '14:15:10' },
            { role: 'staff', text: '大哥您别急，我特别理解您的心情，生病了谁都想马上好。', highlight: true, note: '先共情', time: '14:15:18' },
            { role: 'staff', text: '不过中成药起效确实温和些。您看说明书这里写了，通常三天后症状会明显缓解。如果明天还不见好，您可以来找我，我帮您联系医生。', highlight: true, note: '再讲理', time: '14:15:35' },
            { role: 'user', text: '行吧，那我再吃两天看看。', time: '14:15:50' }
        ]
    }
];

// 近7日趋势数据（用于指标详情）
const metricTrendData = {
    0: { // 客流量
        labels: ['01-07', '01-08', '01-09', '01-10', '01-11', '01-12', '01-13'],
        data: [1180, 1210, 1195, 1230, 1220, 1200, 1250],
        unit: '人'
    },
    1: { // 工牌使用率
        labels: ['01-07', '01-08', '01-09', '01-10', '01-11', '01-12', '01-13'],
        data: [78, 80, 82, 80, 83, 80, 85],
        unit: '%'
    },
    2: { // 平均使用时长
        labels: ['01-07', '01-08', '01-09', '01-10', '01-11', '01-12', '01-13'],
        data: [7.5, 7.6, 7.8, 7.4, 7.5, 7.7, 7.2],
        unit: 'h'
    }
};

// 昨日分时趋势数据（仅客流量）
const metricHourlyData = {
    0: { // 客流量
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        data: [12, 8, 15, 125, 180, 210, 165, 85],
        unit: '人'
    },
    1: { // 工牌使用率
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        data: [0, 0, 15, 85, 95, 92, 88, 45],
        unit: '%'
    },
    2: { // 平均使用时长
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        data: [0, 0, 0.5, 3.5, 5.2, 6.8, 7.2, 4.5],
        unit: 'h'
    }
};

// 门店排行数据
const metricStoreData = {
    0: [ // 客流量
        { name: '中心广场店', value: '298人' },
        { name: '滨江路分店', value: '265人' },
        { name: '体育馆店', value: '242人' },
        { name: '大学城店', value: '210人' },
        { name: '老城区店', value: '188人' },
        { name: '高新区店', value: '47人' }
    ],
    1: [ // 工牌使用率
        { name: '体育馆店', value: '96%' },
        { name: '中心广场店', value: '92%' },
        { name: '滨江路分店', value: '88%' },
        { name: '高新区店', value: '76%' },
        { name: '大学城店', value: '65%' },
        { name: '老城区店', value: '58%' }
    ],
    2: [ // 平均使用时长
        { name: '中心广场店', value: '8.5h' },
        { name: '滨江路分店', value: '8.2h' },
        { name: '体育馆店', value: '7.6h' },
        { name: '高新区店', value: '7.1h' },
        { name: '大学城店', value: '6.5h' },
        { name: '老城区店', value: '5.8h' }
    ]
};
