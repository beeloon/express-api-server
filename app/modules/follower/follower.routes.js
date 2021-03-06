import express from 'express';

import followerController from './follower.controller';

const createFollowerRoutes = (router) => {
  const followerRouter = express.Router();

  followerRouter.get('/', followerController.listAllFollowers);
  followerRouter.delete('/', followerController.deleteAllFollowers);

  router.use('/followers', followerRouter);
};

export default createFollowerRoutes;
