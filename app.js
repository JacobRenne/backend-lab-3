const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('public'))

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}`))

const db = require('./connectionMySQL')

///////// Games table
async function getGames() {
  const [rows] = await db.execute('SELECT * FROM games')
  return rows
}

app.get('/api/games', async(req, res) => {
  try {
    const games = await getGames()
    res.json(games)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

async function getGame(id) {
  const [rows] = await db.execute('SELECT * FROM games WHERE gameId = ?', [id])
  return rows
}

app.get('/api/games/:id', async(req, res) => {
  const { id } = req.params
  
  try {
    const game = await getGame(id)
    res.json(game[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

async function createGame(title, developer, releaseYear, price, categoryId) {
  let sql = 'INSERT INTO games (title, developer, releaseYear, price, categoryId) VALUES (?,?,?,?,?)'
  let params = [title, developer, releaseYear, price, categoryId]

  const [result] = await db.execute(sql, params)
  return result
}

app.post('/api/games', async(req, res) => {
  const { title, developer, releaseYear, price, categoryId } = req.body

  try {
    await createGame(title, developer, releaseYear, price, categoryId)
    res.status(201).json({ success: true, message: 'Game added' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

async function updateGame(title, developer, releaseYear, price, categoryId, gameId) {
  let sql = 'UPDATE games SET title = ?, developer = ?, releaseYear = ?, price = ?, categoryId = ? WHERE gameId = ?'
  let params = [title, developer, releaseYear, price, categoryId, gameId]

  const [result] = await db.execute(sql, params)
  return result
}

app.put('/api/games', async(req, res) => {
  const { title, developer, releaseYear, price, categoryId, gameId } = req.body

  try {
    await updateGame(title, developer, releaseYear, price, categoryId, gameId)
    res.status(201).json({ success: true, message: 'Game updated' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

async function deleteGame(id) {
  let sql = 'DELETE FROM games WHERE gameId = ?'
  
  const [result] = await db.execute(sql, [id])
  return result
}

app.delete('/api/games/:id', async(req, res) => {
  const { id } = req.params

  try {
    await deleteGame(id)
    res.status(201).json({ success: true, message: 'Game deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
// Statistics requirement
async function getGamesCount() {
  const [rows] = await db.execute('SELECT COUNT(*) AS gameCount FROM games')
  return rows
}

app.get('/api/count', async(req, res) => {
  try {
    const gameCount = await getGamesCount()
    res.json(gameCount[0])
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

///////// Categories table
async function getCategories() {
  const [rows] = await db.execute('SELECT * FROM categories')
  return rows
}

app.get('/api/categories', async(req, res) => {
  try {
    const categories = await getCategories()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

async function getCategory(id) {
  const [rows] = await db.execute('SELECT * FROM categories WHERE categoryId = ?', [id])
  return rows
}

app.get('/api/categories/:id', async(req, res) => {
  const { id } = req.params
  
  try {
    const category = await getCategory(id)
    res.json(category[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

async function createCategory(categoryName) {
  let sql = 'INSERT INTO categories (categoryName) VALUES (?)'
  
  const [result] = await db.execute(sql, [categoryName])
  return result
}

app.post('/api/categories', async(req, res) => {
  const { categoryName } = req.body

  try {
    await createCategory(categoryName)
    res.status(201).json({ success: true, message: 'Category added' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

async function updateCategory(categoryName, categoryId) {
  let sql = 'UPDATE categories SET categoryName = ? WHERE categoryId = ?'
  let params = [categoryName, categoryId]

  const [result] = await db.execute(sql, params)
  return result
} 

app.put('/api/categories', async(req, res) => {
  const { categoryName, categoryId } = req.body

  try {
    await updateCategory(categoryName, categoryId)
    res.status(201).json({ success: true, message: 'Category updated' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

async function deleteCategory(id) {
  let sql = 'DELETE FROM categories WHERE categoryId = ?'

  const [result] = await db.execute(sql, [id])
  return result
}

app.delete('/api/categories/:id', async(req, res) => {
  const { id } = req.params

  try {
    await deleteCategory(id)
    res.status(201).json({ success: true, message: 'Category deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// VG Join requirement
async function getGamesAndCategories() {
  const sql = `
  SELECT games.title, games.developer, games.releaseYear, games.price, categories.categoryName
  FROM games
  JOIN categories ON games.categoryId = categories.categoryId`

  const [rows] = await db.execute(sql)
  return rows
}

app.get('/api/games-categories', async(req, res) => {
  try {
    const gamesAndCats = await getGamesAndCategories()
    res.json(gamesAndCats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})