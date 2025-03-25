CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    mood TEXT NOT NULL
);

-- 插入一些示例数据
INSERT INTO recipes (name, ingredients, instructions, mood) VALUES
    ('温暖巧克力布朗尼', '黑巧克力,黄油,鸡蛋,糖,面粉', '1. 融化巧克力和黄油\n2. 搅拌其他原料\n3. 烤25分钟', 'sad'),
    ('清爽水果沙拉', '草莓,蓝莓,橙子,蜂蜜', '1. 切水果\n2. 搅拌\n3. 淋上蜂蜜', 'happy'),
    ('辣味意大利面', '意大利面,辣椒,蒜,橄榄油', '1. 煮面\n2. 炒制酱料\n3. 拌面', 'angry'),
    ('薄荷柠檬茶', '绿茶,薄荷叶,柠檬,蜂蜜', '1. 泡茶\n2. 加入薄荷和柠檬\n3. 加蜂蜜调味', 'anxious'); 