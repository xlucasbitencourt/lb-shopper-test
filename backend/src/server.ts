import express, { Router, Request, Response } from 'express';
import cors from 'cors';

const PORT = 8080;

const app = express();

const route = Router()

app.use(express.json())
app.use(cors())

route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' })
})

app.use(route)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))