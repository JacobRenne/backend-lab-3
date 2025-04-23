const express = require('express')
const app = express()
const cors = require('cors')

const createConnection = require('./connectionMYSQL')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('public'))

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}`))


// Games
async function getGames() {
  const connection = await createConnection()
  const [rows] = await connection.execute('SELECT * FROM game')
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