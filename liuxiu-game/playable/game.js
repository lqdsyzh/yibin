/* 《刘秀直招》可玩原型 — 事件驱动策略小游戏
 * 五项指标：朝廷 / 士族 / 民望 / 军心 / 财政
 * 事件来源标注：《后汉书》H 段、《资治通鉴》Z 条
 */
(function () {
  'use strict';

  var ATTRS = ['court', 'gentry', 'popular', 'military', 'treasury'];

  var DIFFICULTY = {
    hard: {
      label: '史实（Hard）',
      start: { court: 32, gentry: 28, popular: 46, military: 52, treasury: 34 },
      scale: 1.35,
      rounds: 12,
      /* 结局阈值：随难度收紧 */
      great: 74, good: 66, middling: 55, poor: 40
    },
    normal: {
      label: '普通（Normal）',
      start: { court: 50, gentry: 45, popular: 50, military: 50, treasury: 45 },
      scale: 1.0,
      rounds: 12,
      great: 76, good: 70, middling: 60, poor: 46
    },
    easy: {
      label: '休闲（Easy）',
      start: { court: 62, gentry: 58, popular: 58, military: 58, treasury: 60 },
      scale: 0.65,
      rounds: 10,
      great: 78, good: 72, middling: 62, poor: 48
    }
  };

  /* 结局：由岁末考评与极端指标触发 */
  var ENDINGS = {
    great: {
      title: '光武中兴',
      text: '政通人和，四方来朝。你重新聚拢了士族，安抚了编户，也守住了边陲。\n史笔曰：创业之君，允为称首。'
    },
    good: {
      title: '守成之局',
      text: '天下初定，虽未大治，然仓廪有余、吏不苛责。可谓守成有余，开拓不足。'
    },
    middling: {
      title: '勉强支撑',
      text: '社稷无恙，而民有怨声。百姓口中还念着你，但语气已不如当年。'
    },
    poor: {
      title: '国势渐衰',
      text: '政令不出州郡，士族观望，戍卒怨诽。你守住了这座城，却没守住这个朝廷。'
    },
    fallen: {
      title: '为莽所灭',
      text: '绿林已入雒阳。你拾起玺绶时，才明白当年那句"唯谦可以服人"为何无人肯听。'
    }
  };

  /* 事件树：src 为史料出处，opt[].fx 为指标增减，opt[].next 指定后续事件 */
  var EVENTS = {
    e1: {
      title: '舂陵起兵',
      src: '《后汉书·光武帝纪》H1｜《资治通鉴》Z1',
      text: '建武三年某夜，你在舂陵举火。响应者不过数十人，火光映着南阳的旷野。\n有人劝你暂避锋头，有人劝你檄告天下、聚四方豪杰。',
      opt: [
        { label: '檄告州郡，数王莽之罪', fx: { popular: 6, court: 2 }, next: 'e2' },
        { label: '收拢宗族豪右，私募部曲', fx: { military: 6, treasury: -6, popular: -3 }, next: 'e2' },
        { label: '夜行山中，避官军锋芒', fx: { military: -4, treasury: -2, popular: 2 }, next: 'e3' }
      ]
    },
    e2: {
      title: '昆阳之战',
      src: '《后汉书·光武帝纪》H2｜《资治通鉴》Z2',
      text: '王邑率数十万众围昆阳，而你城中不过八九千人，将士皆恐惧。\n"今兵少，惧不克，请还城。"诸将皆欲散归。',
      opt: [
        { label: '留将士固守，亲自率敢死三千人突阵', fx: { military: 14, court: 4, popular: 6, treasury: -5 }, next: 'e4' },
        { label: '假托天命，鼓噪以动军心', fx: { popular: 8, military: 6, court: -5 }, next: 'e4' },
        { label: '乘夜突围，另择他处再起', fx: { military: -8, treasury: -4, popular: -5 }, next: 'e4' }
      ]
    },
    e3: {
      title: '随众入山',
      src: '《后汉书·王匡传》H7',
      text: '你随下邳人王匡入山，收集亡命之徒，旬日间至数千人，在樊山、织县之间徘徊。\n棘阳大姓苏氏送来一车粮，却什么话也没说。',
      opt: [
        { label: '厚酬苏氏，与其结为姻好', fx: { treasury: -6, gentry: 8, court: 3 }, next: 'e4' },
        { label: '推辞不受，只以礼相待', fx: { gentry: 4, treasury: 1, popular: 5 }, next: 'e4' },
        { label: '请其子弟为部曲首领', fx: { military: 6, gentry: -3, popular: -3 }, next: 'e4' }
      ]
    },
    e4: {
      title: '更始封你为偏将军',
      src: '《后汉书·光武帝纪》H4',
      text: '更始帝即位，拜你为偏将军，行大司马，封萧王。\n诏书到时，众将劝你北还洛阳——那更可能是笼中之物。',
      opt: [
        { label: '奉诏北行，入朝面圣', fx: { court: 10, popular: -6, military: -6 }, next: 'e5' },
        { label: '称疾不赴，仍驻兵于外', fx: { military: 6, court: -5, popular: 3 }, next: 'e5' },
        { label: '遣使贡献黄金，退守宛、邓之间', fx: { treasury: -4, court: 3, gentry: 4 }, next: 'e5' }
      ]
    },
    e5: {
      title: '鄗城称帝',
      src: '《后汉书·光武帝纪》H9',
      text: '刘秀于鄗城昼见彗星，夜闻栘鼓角——这些祥瑞在汉人心里意味着什么，他自己清楚。\n众将鼓噪请即帝位。',
      opt: [
        { label: '即皇帝位于鄗，改元建武', fx: { court: 12, gentry: -4, popular: 4 }, next: 'e6' },
        { label: '固辞不受，先平河北以观其变', fx: { military: 8, court: -6, popular: 5 }, next: 'e6' }
      ]
    },
    e6: {
      title: '赤眉东来',
      src: '《资治通鉴》Z8',
      text: '赤眉军转战关中，饥疲思还，终于东归，直逼洛阳。\n更始帝出奔，百姓稽首于道，随之者数十万。',
      opt: [
        { label: '严阵以待，闭城拒守', fx: { military: 4, court: 5, popular: -8, treasury: -4 }, next: 'e7' },
        { label: '开城抚纳，驱民入城避兵', fx: { popular: 10, treasury: -8, court: -3, military: -3 }, next: 'e7' },
        { label: '派将追击，务必歼灭', fx: { military: 10, popular: -6, court: -2, treasury: -5 }, next: 'e7' }
      ]
    },
    e7: {
      title: '柴桑之捷',
      src: '《后汉书·光武帝纪》H12',
      text: '赤眉军至柴桑，被汉军夜击，斩首数万级。\n但捷报未至，洛阳已是一座空城。',
      opt: [
        { label: '西入洛阳，修宫室，祀郊庙', fx: { court: 8, treasury: -10, popular: 4 } },
        { label: '东巡一圈，抚辑新归之民', fx: { popular: 10, treasury: -5, court: -2 } },
        { label: '偃武修文，广开言路', fx: { gentry: 8, court: 3, military: -4 } }
      ]
    },
    e8: {
      title: '云台二十八将',
      src: '《后汉书·光武帝纪》H14',
      text: '图画功臣二十八将于云台。论功行赏时，汝南太守陶谦的名字被划去——因为你曾受其厚遇。\n"今日诸将当已集于云台矣。"',
      opt: [
        { label: '坚持私恩，举荐为国除', fx: { court: 6, gentry: -4, popular: 5 } },
        { label: '顾念旧恩，密使人怀金遗之', fx: { gentry: 7, treasury: -5, court: -3 } },
        { label: '当众直言举荐，引得群臣议论', fx: { court: 8, gentry: -6, popular: 4 } }
      ]
    },
    e9: {
      title: '轻徭薄赋',
      src: '《后汉书·光武帝纪》H16｜《资治通鉴》Z14',
      text: '天下初定，户口凋敝。你下令："凡是天下郡国，只输常赋，不更徭役。"\n有人说这是与民休息，也有人说这是放弃了兵源。',
      opt: [
        { label: '大赦天下，减省刑罚', fx: { popular: 12, court: 3, military: -5 } },
        { label: '仅免今岁租，役仍如故', fx: { popular: 5, military: 3, treasury: 2 } },
        { label: '招抚流民，令复业田里', fx: { popular: 8, treasury: -6, military: 5 } }
      ]
    },
    e10: {
      title: '郡国举贤',
      src: '《后汉书·光武帝纪》H18',
      text: '诏曰："岁举孝廉，废秀异。"\n各郡国推上来的名单里有あなたの旧部，也有你从未听说的人。',
      opt: [
        { label: '亲自策试，罢黜不职者', fx: { court: 8, gentry: -5, popular: 4 } },
        { label: '尽其所用，示天下以宽容', fx: { gentry: 8, court: -4, popular: 3 } },
        { label: '命公卿共议，各衙门掾属皆可荐举', fx: { gentry: 6, court: 2, popular: -2 } }
      ]
    },
    e11: {
      title: '北面称臣',
      src: '《后汉书·光武帝纪》H20',
      text: '匈奴单于遣使入朝，愿和亲。你召集群臣议之，窦融力主信之。',
      opt: [
        { label: '遣使报聘，厚遗单于', fx: { treasury: -8, military: 4, popular: 5 } },
        { label: '厚往薄来，以礼相待而不费财', fx: { treasury: 2, military: 2, court: 2 } },
        { label: '修武备以待之，命边郡缮甲', fx: { military: 10, treasury: -5, popular: -4 } }
      ]
    },
    e12: {
      title: '初置屯田',
      src: '《后汉书·光武帝纪》H22｜《资治通鉴》Z18',
      text: '边郡久荒，粮运屡绝。你听从第五伦议："以荒地招流民，耕之则国家有兵，国有余粮。"',
      opt: [
        { label: '大举屯田，募民于边', fx: { treasury: 12, military: 6, popular: 4 } },
        { label: '先在数郡试点，视其成效', fx: { treasury: 5, court: 3, popular: 1 } },
        { label: '归耕于农，罢边戍之费', fx: { treasury: 4, military: -8, popular: 6 } }
      ]
    },
    e13: {
      title: '度田核田',
      src: '《后汉书·光武帝纪》H24｜《资治通鉴》Z20',
      text: "诏下郡国，检校垦田亩数。查出的隐匿田亩触目惊心——豪族占田，编户无田。\n你打算动他们。",
      opt: [
        { label: '严查到底，依法没入隐田', fx: { popular: 12, gentry: -12, treasury: 8 } },
        { label: '只令自首者免罪，不再追究', fx: { gentry: 8, popular: 2, treasury: 2 } },
        { label: '诏令郡国核查，不设严罚', fx: { gentry: 4, court: 3, popular: -2 } }
      ]
    },
    e14: {
      title: '功臣宴饮',
      src: '《后汉书·光武帝纪》H26',
      text: '置酒未央，功臣列坐。诸将论及当年之战，争相以功自陈；有人提及："某将可斩！"殿上寂然。',
      opt: [
        { label: '举觞解嘲，尽欢而散', fx: { gentry: 7, military: 4, court: -3 } },
        { label: '录其功勋，按制封赏，毋得自矜', fx: { court: 8, gentry: -3, military: -2 } },
        { label: '令军法从事，以肃军纪', fx: { military: 8, court: 5, gentry: -7, popular: -3 } }
      ]
    },
    e15: {
      title: '南征北讨',
      src: '《资治通鉴》Z24',
      text: '公孙述据蜀，荆门、渔阳之乱相继。诏书到你手上时，兵不足、粮不给。',
      opt: [
        { label: '南征公孙述，倾国之力一战', fx: { military: 12, treasury: -14, court: 6, popular: -6 } },
        { label: '先平北边，南事缓图', fx: { military: 7, treasury: -4, gentry: 3 } },
        { label: '诏度支条奏，量力而行', fx: { court: 5, treasury: 3, military: -4, popular: 2 } }
      ]
    },
    e16: {
      title: '羌人来犯',
      src: '《后汉书·羌传》H33',
      text: '武都、陇西诸羌反，杀了长吏。金城诸县为之震动，朝议纷纭。',
      opt: [
        { label: '遣将讨之，兵不血刃而羌服', fx: { military: 9, court: 4, treasury: -6 } },
        { label: '徙其民于内地，置属国以羁縻', fx: { gentry: 4, popular: 4, military: -3, court: 2 } },
        { label: '守御不出，坚壁清野', fx: { military: -2, treasury: -3, popular: -2 } }
      ]
    },
    e17: {
      title: '水旱之灾',
      src: '《后汉书·光武帝纪》H31',
      text: '河南蝗起，百姓乏食。诏书下曰："勿令我百姓死于蝗。" \n于是天下各郡开仓廪，出糴粟。',
      opt: [
        { label: '发太仓之粟，尽赈饥民', fx: { popular: 14, treasury: -12 } },
        { label: '令有司以俸禄助赈', fx: { popular: 6, treasury: -4, gentry: -3 } },
        { label: '以工代赈，兴修水利', fx: { popular: 7, treasury: -6, military: 3, court: 3 } }
      ]
    },
    e18: {
      title: '外戚与权臣',
      src: '《后汉书·光武帝纪》H36',
      text: '外戚窦氏、显戚班氏势倾中外，尚书令侯霸之流益州牧皆用私谒。\n有人劝你"事无大小皆先关白"——那是外戚的话。',
      opt: [
        { label: '一切以公，断外戚私谒之端', fx: { court: 10, gentry: -6, popular: 6 } },
        { label: '用而薄之，使其不扰', fx: { court: 4, gentry: 3, popular: -1 } },
        { label: '以柔克刚，曲意与之周旋', fx: { court: -3, gentry: 6, military: -2 } }
      ]
    },
    e19: {
      title: '定官制、修庙社',
      src: '《后汉书·百官志》H40',
      text: '定官职，修制度，改正朔，定音律。\n邓禹、范升等争于朝堂，一以旧章，一以新制。',
      opt: [
        { label: '参酌古今，断自睿心', fx: { court: 9, gentry: -2, popular: 2 } },
        { label: '尽从群议，广采众长', fx: { gentry: 7, court: -2, popular: 3 } },
        { label: '因循旧制，勿扰既成', fx: { court: -3, gentry: 4, military: 2 } }
      ]
    },
    e20: {
      title: '求言诏',
      src: '《后汉书·光武帝纪》H42',
      text: '诏求直言："欲闻得失，冀朕有改。" \n奏疏堆满案头，有骂朝廷的，也有求一官半职的。',
      opt: [
        { label: '亲阅披览，择善而从', fx: { popular: 10, court: 6, gentry: -2 } },
        { label: '令中书台分类转递，有司各归其责', fx: { court: 4, popular: 3 } },
        { label: '择其可采者下诏报曰', fx: { popular: 6, court: 3, treasury: -2 } }
      ]
    },
    e21: {
      title: '省并州郡',
      src: '《后汉书·百官志》H45',
      text: '天下初定，郡县过多，吏民困于供给。你决定裁撤冗官。',
      opt: [
        { label: '并省四百余县，吏职减损过半', fx: { treasury: 11, popular: 7, court: 4, gentry: -4 } },
        { label: '先并边郡，后及内地', fx: { treasury: 6, military: 5, court: 3 } },
        { label: '暂缓，恐生变', fx: { court: -3, treasury: -3, popular: -2 } }
      ]
    },
    e22: {
      title: '西羌初叛',
      src: '《后汉书·羌传》H48',
      text: '金城、陇西羌反，攻城郭，杀长吏。你破格提拔了一个出身寒微、屡立战功的将领。',
      opt: [
        { label: '不拘资历，唯才是举', fx: { military: 9, gentry: -6, court: 6, popular: 5 } },
        { label: '循资历用旧臣，稳中求进', fx: { gentry: 5, court: 2, military: -3 } },
        { label: '先赏抚有功之将，示朝廷不忘旧人', fx: { military: 4, treasury: -5, gentry: 3, popular: -1 } }
      ]
    },
    e23: {
      title: '太子之选',
      src: '《后汉书·光武帝纪》H50',
      text: '立皇后、废太子的旧事仍在众臣心里。刘庄年长而性弱，刘炟年幼而聪颖。\n群臣各有所附。',
      opt: [
        { label: '立庄为太子，以长幼为序', fx: { court: 6, gentry: 4, popular: 2 } },
        { label: '听群臣公议', fx: { gentry: 6, court: -2, popular: 3 } },
        { label: '立炟为皇太子，另立郭氏为皇后', fx: { gentry: 8, court: 3, popular: -2, military: -2 } }
      ]
    },
    e24: {
      title: '刑法之议',
      src: '《后汉书·律历志》H52',
      text: '有人上书言律令烦苛，诈狱多不自尽。诏廷尉议减刑省罚。',
      opt: [
        { label: '减死罪一等，省减律令烦文', fx: { popular: 11, court: 2, gentry: -3 } },
        { label: '维持旧律，不为轻改', fx: { court: 5, gentry: 3, popular: -4 } },
        { label: '令郡国岁举冤狱，择其冤者平反', fx: { popular: 7, court: 3, treasury: -3 } }
      ]
    },
    e25: {
      title: '年号与封禅',
      src: '《后汉书·光武帝纪》H55',
      text: '群臣请封禅梁父，告天地以功业。\n你想起秦始皇的结局，也想起王莽的《金策》。',
      opt: [
        { label: '不行封禅，恐有劳民', fx: { popular: 8, treasury: 4, court: -4, gentry: -2 } },
        { label: '议而不行，谦让之美天下共知', fx: { popular: 7, gentry: 5, court: 2 } },
        { label: '备仪而往', fx: { court: 8, gentry: 6, treasury: -10, popular: -4 } }
      ]
    },
    e26: {
      title: '遗令',
      src: '《后汉书·光武帝纪》H58',
      text: '病榻之上，你想起这一生：起于舂陵，终于洛阳。\n还有哪些事没做完？',
      opt: [
        { label: '戒子孙曰："吾为人主，无遗后患"', fx: { court: 5, gentry: 3, popular: 4 } },
        { label: '严令薄葬，无藏金玉珠宝', fx: { popular: 9, treasury: 3, court: -2 } },
        { label: '诏公卿直言己失，不讳己过', fx: { popular: 10, court: 4, gentry: -4 } }
      ]
    },
    e27: {
      title: '平定诸部',
      src: '《资治通鉴》Z40',
      text: '南匈奴、乌桓、鲜卑先后归附，车驾亲至塞下。\n单于稽首道："愿得执鞭，效犬马之劳。"',
      opt: [
        { label: '大陈兵马以示威，然后厚赐而遣', fx: { military: 8, treasury: -8, popular: 4 } },
        { label: '不陈兵，遣使谕之，赐以牛酒', fx: { popular: 7, treasury: -3, court: 3 } },
        { label: '徙其众于塞内，杂居中国', fx: { military: 5, gentry: 4, popular: -3, treasury: -5 } }
      ]
    },
    e28: {
      title: '宫室之议',
      src: '《后汉书·光武帝纪》H60',
      text: '南宫建成，制度草创。有司奏请："陛下宫室卑陋，诚为不敬。"',
      opt: [
        { label: '曰："天下尚未安定，未敢劳民"', fx: { popular: 8, treasury: 4, court: -3 } },
        { label: '量力增饰，不逾旧制', fx: { court: 5, treasury: -4, gentry: 2 } }
      ]
    }
  };

  /* 常驻事件池（无 next 时从中随机抽取）
   * e1–e7 为主线开局（e1 之后按 next 串成 e2→e4→e5→e6→e7），不在池中重复出现 */
  var POOL = [
    'e8', 'e9', 'e10', 'e11', 'e12', 'e13', 'e14', 'e15', 'e16',
    'e17', 'e18', 'e19', 'e20', 'e21', 'e22', 'e23', 'e24', 'e25',
    'e26', 'e27', 'e28'
  ];

  var el = {};
  var state = {
    diff: 'normal',
    attrs: null,
    round: 0,
    maxRounds: 12,
    scale: 1,
    running: false,
    paused: false,
    started: false,
    collapse: 0,
    used: {},
    score: 0
  };

  function $(id) { return document.getElementById(id); }

  function init() {
    el.court = $('court');
    el.gentry = $('gentry');
    el.popular = $('popular');
    el.military = $('military');
    el.treasury = $('treasury');
    el.title = $('eventTitle');
    el.text = $('eventText');
    el.options = $('options');
    el.lead = $('leaderList');
    el.difficulty = $('difficulty');
    el.start = $('startBtn');
    el.pause = $('pauseBtn');
    el.history = $('historyBtn');
    el.music = $('musicBtn');
    el.bgm = $('bgm');

    el.start.addEventListener('click', start);
    el.pause.addEventListener('click', togglePause);
    el.history.addEventListener('click', openHistory);
    el.music.addEventListener('click', toggleMusic);

    renderAttrs();
    renderLeaderboard();
    el.options.innerHTML = '';
  }

  function start() {
    var cfg = DIFFICULTY[el.difficulty.value] || DIFFICULTY.normal;
    state.diff = el.difficulty.value;
    state.attrs = {};
    ATTRS.forEach(function (k) { state.attrs[k] = cfg.start[k]; });
    state.scale = cfg.scale;
    state.maxRounds = cfg.rounds;
    state.round = 0;
    state.running = true;
    state.paused = false;
    state.started = false;
    state.collapse = 0;
    state.used = {};
    state.score = 0;

    el.start.disabled = true;
    el.pause.disabled = false;
    el.pause.textContent = '暂停';
    el.difficulty.disabled = true;
    nextEvent();
  }

  function togglePause() {
    if (!state.running) return;
    state.paused = !state.paused;
    el.pause.textContent = state.paused ? '继续' : '暂停';
    if (state.paused) {
      el.title.textContent = '已暂停';
      el.text.textContent = '游戏已暂停。点击"继续"回到当前事件。';
      el.options.innerHTML = '';
    } else {
      renderCurrent();
    }
  }

  function nextEvent() {
    if (!state.running) return;
    state.round++;
    if (state.round > state.maxRounds) {
      finish();
      return;
    }
    var id = pickEvent();
    state.current = id;
    renderCurrent();
  }

  function pickEvent() {
    /* 开局固定走主线首事件 e1，其后由 next 链推进 */
    if (!state.started) {
      state.started = true;
      state.used.e1 = true;
      return 'e1';
    }
    var candidates = POOL.filter(function (id) { return !state.used[id]; });
    if (candidates.length === 0) {
      candidates = POOL.slice();
    }
    var id = candidates[Math.floor(Math.random() * candidates.length)];
    state.used[id] = true;
    return id;
  }

  function renderCurrent() {
    var ev = EVENTS[state.current];
    if (!ev) return;
    el.title.textContent = '【' + ev.title + '】';
    el.text.textContent = ev.text + '\n\n〔史料〕' + ev.src;

    el.options.innerHTML = '';
    ev.opt.forEach(function (opt, idx) {
      var b = document.createElement('button');
      b.textContent = (idx + 1) + '. ' + opt.label;
      b.addEventListener('click', function () { choose(opt); });
      el.options.appendChild(b);
    });
    renderAttrs();
  }

  function choose(opt) {
    if (!state.running || state.paused) return;
    ATTRS.forEach(function (k) {
      if (opt.fx && typeof opt.fx[k] === 'number') {
        var d = Math.round(opt.fx[k] * state.scale);
        state.attrs[k] = Math.max(0, Math.min(100, state.attrs[k] + d));
      }
    });
    renderAttrs();

    if (extreme()) {
      finish('fallen');
      return;
    }
    if (opt.next && EVENTS[opt.next]) {
      state.current = opt.next;
      renderCurrent();
      return;
    }
    nextEvent();
  }

  function extreme() {
    /* 单次事件跌到 0 不即刻判负：需连续两次崩盘才覆亡，避免一次波动直接结束游戏 */
    var a = state.attrs;
    var collapsed = a.military <= 0 || a.treasury <= 0;
    state.collapse = collapsed ? (state.collapse || 0) + 1 : 0;
    return state.collapse >= 2;
  }

  function finish(forced) {
    state.running = false;
    el.start.disabled = false;
    el.pause.disabled = true;
    el.difficulty.disabled = false;

    var score = computeScore();
    var key = forced || pickEnding(score);
    var ending = ENDINGS[key] || ENDINGS.middling;

    el.title.textContent = '【' + ending.title + '】';
    el.text.textContent = ending.text +
      '\n\n最终评鉴：' + score + ' 分（' + (DIFFICULTY[state.diff] || DIFFICULTY.normal).label + '）' +
      '\n朝廷 ' + state.attrs.court + '　士族 ' + state.attrs.gentry + '　民望 ' + state.attrs.popular +
      '　军心 ' + state.attrs.military + '　财政 ' + state.attrs.treasury;
    el.options.innerHTML = '';

    saveScore(score, ending.title);
    renderLeaderboard();
  }

  function pickEnding(score) {
    var t = DIFFICULTY[state.diff] || DIFFICULTY.normal;
    if (score >= t.great) return 'great';
    if (score >= t.good) return 'good';
    if (score >= t.middling) return 'middling';
    if (score >= t.poor) return 'poor';
    return 'fallen';
  }

  function computeScore() {
    var a = state.attrs;
    var s = 0;
    s += a.court * 0.22 + a.gentry * 0.18 + a.popular * 0.3 + a.military * 0.18 + a.treasury * 0.12;
    return Math.max(0, Math.min(100, Math.round(s)));
  }

  function renderAttrs() {
    var a = state.attrs || (DIFFICULTY.normal.start);
    el.court.textContent = a.court;
    el.gentry.textContent = a.gentry;
    el.popular.textContent = a.popular;
    el.military.textContent = a.military;
    el.treasury.textContent = a.treasury;
  }

  var LB_KEY = 'liuxiu-leaderboard-v1';

  function loadScores() {
    try {
      var raw = localStorage.getItem(LB_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveScore(score, title) {
    var arr = loadScores();
    arr.push({ score: score, title: title, diff: state.diff, at: Date.now() });
    arr.sort(function (a, b) { return b.score - a.score; });
    arr = arr.slice(0, 10);
    try { localStorage.setItem(LB_KEY, JSON.stringify(arr)); } catch (e) { /* 忽略隐私模式写入失败 */ }
  }

  function renderLeaderboard() {
    var arr = loadScores();
    el.lead.innerHTML = '';
    if (arr.length === 0) {
      var li = document.createElement('li');
      li.textContent = '暂无记录';
      el.lead.appendChild(li);
      return;
    }
    arr.forEach(function (row) {
      var li = document.createElement('li');
      li.textContent = row.score + ' 分 · ' + row.title;
      el.lead.appendChild(li);
    });
  }

  function toggleMusic() {
    if (!el.bgm) return;
    if (el.bgm.paused) {
      var p = el.bgm.play();
      if (p && p.catch) p.catch(function () { /* 自动播放被拦截时忽略 */ });
      el.music.textContent = '背景音乐 关';
    } else {
      el.bgm.pause();
      el.music.textContent = '背景音乐 开';
    }
  }

  function openHistory() {
    window.open(
      'https://github.com/lqdsyzh/yibin/blob/feature/liuxiu-full/liuxiu-game/docs/originals.md',
      '_blank'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window._liuxiu = { state: state, events: EVENTS };
})();
