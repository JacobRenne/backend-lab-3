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
    return res.json({game})
  } catch (error) {
    return res.status(500).json({ error: error.message })
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
    return res.status(201).json({ success: true, message: 'Game added' })
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
    return res.status(201).json({ success: true, message: 'Game updated' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
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
    return res.status(201).json({ success: true, message: 'Game deleted' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
})

///////// Categories table

