const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('recipes.db');

app.use(express.static('public'));
app.use(express.json());

// 初始化数据库
db.serialize(() => {
  // 创建食谱表（如果不存在）
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    mood TEXT NOT NULL,
    preparation_time INTEGER,
    cuisine TEXT,
    image_url TEXT
  )`);

  // 检查数据库是否为空，如果是则添加示例食谱
  db.get("SELECT COUNT(*) as count FROM recipes", (err, result) => {
    if (err) {
      console.error('数据库查询错误:', err);
      return;
    }
    
    if (result.count === 0) {
      console.log('初始化数据库并添加示例食谱...');
      
      // 添加多种心情的食谱
      const recipes = [
        // 快乐心情的食谱
        {
          name: '阳光柠檬煎饼',
          ingredients: '面粉, 鸡蛋, 牛奶, 柠檬皮, 蜂蜜',
          instructions: '将所有材料混合，煎至金黄色，淋上蜂蜜即可。',
          mood: '快乐',
          preparation_time: 20,
          cuisine: '美式',
          image_url: '/images/lemon_pancakes.jpg'
        },
        {
          name: '彩虹水果沙拉',
          ingredients: '草莓, 蓝莓, 猕猴桃, 芒果, 葡萄',
          instructions: '将水果切成小块，混合并加入少量蜂蜜。',
          mood: '快乐',
          preparation_time: 15,
          cuisine: '国际',
          image_url: '/images/fruit_salad.jpg'
        },
        
        // 忧郁心情的食谱
        {
          name: '热巧克力布朗尼',
          ingredients: '黑巧克力, 黄油, 鸡蛋, 面粉, 核桃',
          instructions: '融化巧克力和黄油，与其他材料混合，烤25分钟。',
          mood: '忧郁',
          preparation_time: 40,
          cuisine: '法式',
          image_url: '/images/brownie.jpg'
        },
        {
          name: '安慰奶油浓汤',
          ingredients: '鸡肉, 胡萝卜, 洋葱, 芹菜, 奶油',
          instructions: '将所有材料炖煮，加入奶油使其浓稠。',
          mood: '忧郁',
          preparation_time: 60,
          cuisine: '家常',
          image_url: '/images/cream_soup.jpg'
        },
        
        // 疲惫心情的食谱
        {
          name: '能量燕麦早餐碗',
          ingredients: '燕麦, 香蕉, 坚果, 蜂蜜, 牛奶',
          instructions: '煮燕麦，加入切片香蕉、坚果和蜂蜜。',
          mood: '疲惫',
          preparation_time: 10,
          cuisine: '健康',
          image_url: '/images/oatmeal.jpg'
        },
        {
          name: '绿色能量冰沙',
          ingredients: '菠菜, 香蕉, 牛油果, 蜂蜜, 椰子水',
          instructions: '将所有材料放入搅拌机中混合成冰沙。',
          mood: '疲惫',
          preparation_time: 5,
          cuisine: '健康',
          image_url: '/images/green_smoothie.jpg'
        },
        
        // 浪漫心情的食谱
        {
          name: '情人节草莓提拉米苏',
          ingredients: '马斯卡彭奶酪, 手指饼干, 草莓, 咖啡, 可可粉',
          instructions: '浸泡饼干，分层放置奶酪混合物和草莓，撒上可可粉。',
          mood: '浪漫',
          preparation_time: 30,
          cuisine: '意式',
          image_url: '/images/tiramisu.jpg'
        },
        {
          name: '红酒炖牛肉',
          ingredients: '牛肉, 红酒, 胡萝卜, 洋葱, 百里香',
          instructions: '将牛肉和蔬菜用红酒慢炖2小时。',
          mood: '浪漫',
          preparation_time: 130,
          cuisine: '法式',
          image_url: '/images/beef_stew.jpg'
        },
        
        // 怀旧心情的食谱
        {
          name: '奶奶的经典饼干',
          ingredients: '面粉, 黄油, 糖, 鸡蛋, 香草精',
          instructions: '混合材料，制成小球，烤至金黄色。',
          mood: '怀旧',
          preparation_time: 45,
          cuisine: '家常',
          image_url: '/images/cookies.jpg'
        },
        {
          name: '传统肉丸意面',
          ingredients: '意面, 牛肉, 番茄酱, 洋葱, 大蒜',
          instructions: '烹饪肉丸，煮意面，混合番茄酱。',
          mood: '怀旧',
          preparation_time: 50,
          cuisine: '意式',
          image_url: '/images/spaghetti.jpg'
        }
      ];
      
      // 插入食谱到数据库
      const stmt = db.prepare('INSERT INTO recipes (name, ingredients, instructions, mood, preparation_time, cuisine, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
      recipes.forEach(recipe => {
        stmt.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.mood, recipe.preparation_time, recipe.cuisine, recipe.image_url);
      });
      stmt.finalize();
      console.log('食谱添加完成!');
    }
  });
});

// 获取所有可用的心情类别
app.get('/api/moods', (req, res) => {
  db.all('SELECT DISTINCT mood FROM recipes', (err, moods) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(moods.map(m => m.mood));
  });
});

// 获取特定心情的所有食谱
app.get('/api/recipes/:mood', (req, res) => {
  const mood = req.params.mood;
  db.all('SELECT * FROM recipes WHERE mood = ?', [mood], (err, recipes) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(recipes);
  });
});

// 添加新食谱
app.post('/api/recipes', (req, res) => {
  const { name, ingredients, instructions, mood, preparation_time, cuisine, image_url } = req.body;
  
  if (!name || !ingredients || !instructions || !mood) {
    return res.status(400).json({ error: '缺少必要字段' });
  }
  
  const sql = 'INSERT INTO recipes (name, ingredients, instructions, mood, preparation_time, cuisine, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [name, ingredients, instructions, mood, preparation_time, cuisine, image_url], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, message: '食谱添加成功' });
  });
});

// 根据菜系搜索食谱
app.get('/api/recipes/cuisine/:cuisine', (req, res) => {
  const cuisine = req.params.cuisine;
  db.all('SELECT * FROM recipes WHERE cuisine = ?', [cuisine], (err, recipes) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(recipes);
  });
});

// 获取特定心情的随机食谱
app.get('/api/recipe/:mood', (req, res) => {
    const mood = req.params.mood;
    db.get('SELECT * FROM recipes WHERE mood = ? ORDER BY RANDOM() LIMIT 1', [mood], (err, recipe) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(recipe);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 