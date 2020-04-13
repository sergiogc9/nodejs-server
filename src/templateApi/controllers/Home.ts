import { RequestHandler } from 'express';

class Home {
	public static index: RequestHandler = (req, res) => res.render('pages/index');
}

export default Home;
