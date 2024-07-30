//Local imports
import Controllers from './class.controller.js';
import TicketService from '../services/ticket_services.js';

const ticketService = new TicketService();

export default class TicketController extends Controllers {
    constructor(){
        super(TicketService);
    }

    async createTicket(req, res, next) {
        try {
            const ticket = await ticketService.createTicket(req.user);
            if(!ticket)  return res.status(404).json({ msg: "Ticket not created" });
            return res.status(200).json(ticket);
        } catch (error) {
            next(error);
        }
    }
}