const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const offerController = require('../controllers/offerController');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const chatController = require('../controllers/chatController');
const upload = require('../utils/fileUpload');
const router = express.Router();

router.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration
);

router.post('/login', validators.validateLogin, userController.login);

router.post(
  '/dataForContest',
  checkToken.checkToken,
  contestController.dataForContest
);

router.post(
  '/pay',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userController.payment
);

router.get(
  '/getCustomersContests',
  checkToken.checkToken,
  contestController.getCustomersContests
);

router.get(
  '/getContestById',
  checkToken.checkToken,
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

router.get(
  '/getAllContests',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  contestController.getContests
);

router.get('/getUser', checkToken.checkAuth);

router.get(
  '/getPendingOffers',
  checkToken.checkToken,
  checkToken.checkModerator,
  offerController.getPendingOffers
);

router.put(
  '/updateOfferStatus/:id',
  checkToken.checkToken,
  checkToken.checkModerator,
  offerController.updateOfferStatus
);

router.get(
  '/downloadFile/:fileName',
  checkToken.checkToken,
  contestController.downloadFile
);

router.put(
  '/updateContest',
  checkToken.checkToken,
  upload.updateContestFile,
  contestController.updateContest
);

router.post(
  '/setNewOffer',
  checkToken.checkToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer
);

router.put(
  '/setOfferStatus',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus
);

router.put(
  '/changeMark',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

router.put(
  '/updateUser',
  checkToken.checkToken,
  upload.uploadAvatar,
  userController.updateUser
);

router.post(
  '/cashout',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  userController.cashout
);

router.post('/newMessage', checkToken.checkToken, chatController.addMessage);

router.get('/getChat', checkToken.checkToken, chatController.getChat);

router.get('/getPreview', checkToken.checkToken, chatController.getPreview);

router.put('/blackList', checkToken.checkToken, chatController.blackList);

router.put('/favorite', checkToken.checkToken, chatController.favoriteChat);

router.post(
  '/createCatalog',
  checkToken.checkToken,
  chatController.createCatalog
);

router.put(
  '/updateNameCatalog',
  checkToken.checkToken,
  chatController.updateNameCatalog
);

router.post(
  '/addNewChatToCatalog',
  checkToken.checkToken,
  chatController.addNewChatToCatalog
);

router.delete(
  '/removeChatFromCatalog',
  checkToken.checkToken,
  chatController.removeChatFromCatalog
);

router.delete(
  '/deleteCatalog',
  checkToken.checkToken,
  chatController.deleteCatalog
);

router.get('/getCatalogs', checkToken.checkToken, chatController.getCatalogs);

module.exports = router;
