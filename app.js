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

// Games table
async function getGames() {
  const [rows] = await db.execute('SELECT * FROM games')
  return rows
}

app.get('/api/games', async (req, res) => {
  try {
    const games = await getGames()
    res.json(games)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

async function getGame(id) {
  const [rows] = await db.execute(
    'SELECT * FROM games WHERE gameId = ?', [id])
  return rows
}

app.get('/api/games/:id', async(req, res) => {
  const { id } = req.params
  
  try {
    const game = await getGame(id)
    res.json({game})
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
})

async function createGame(title, developer, releaseYear, price, categoryId) {
  let sql = 'INSERT INTO games (title, developer, releaseYear, price, categoryId) VALUES (?,?,?,?,?)'
  let params = [title, developer, releaseYear, price, categoryId]

  const [result] = await db.execute(sql, params)
  return result
}

app.post('/api/games', async(req, res) => {
  const { title, developer, releaseYear, price, categoryId} = req.body
  
})