import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemsController {
    async index(req: Request, res: Response) {

        const items = await knex('items').select('*')

        /**
         * Pesquise sobre serialização, ou API Transform
         */
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.100.13:5000/uploads/${item.image}`
            }
        })
    
        return res.json(serializedItems)
    }
}

export default ItemsController

// index, show, create, update, delete