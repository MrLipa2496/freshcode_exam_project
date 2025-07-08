import { createSlice } from '@reduxjs/toolkit';
import { isEqual, remove } from 'lodash';
import * as restController from '../../api/rest/restController';
import CONSTANTS from '../../constants';
import {
  decorateAsyncThunk,
  createExtraReducers,
  rejectedReducer,
} from '../../utils/store';

const CHAT_SLICE_NAME = 'chat';

const initialState = {
  isFetching: true,
  addChatId: null,
  isShowCatalogCreation: false,
  currentCatalog: null,
  chatData: null,
  messages: [],
  error: null,
  isExpanded: false,
  interlocutor: [],
  messagesPreview: [],
  isShow: false,
  chatMode: CONSTANTS.NORMAL_PREVIEW_CHAT_MODE,
  catalogList: [],
  isRenameCatalog: false,
  isShowChatsInCatalog: false,
  catalogCreationMode: CONSTANTS.ADD_CHAT_TO_OLD_CATALOG,
};

//---------- getPreviewChat
export const getPreviewChat = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getPreviewChat`,
  thunk: async () => {
    const { data } = await restController.getPreviewChat();
    return data;
  },
});

const getPreviewChatExtraReducers = createExtraReducers({
  thunk: getPreviewChat,
  fulfilledReducer: (state, { payload }) => {
    state.messagesPreview = payload;
    state.error = null;
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
    state.messagesPreview = [];
  },
});

//---------- getDialogMessages
export const getDialogMessages = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getDialogMessages`,
  thunk: async payload => {
    const { data } = await restController.getDialog(payload);
    return data;
  },
});

const getDialogMessagesExtraReducers = createExtraReducers({
  thunk: getDialogMessages,
  fulfilledReducer: (state, { payload }) => {
    state.messages = payload.messages;
    state.interlocutor = payload.interlocutor;
  },
  rejectedReducer: (state, { payload }) => {
    state.messages = [];
    state.interlocutor = null;
    state.error = payload;
  },
});

//---------- sendMessage
export const sendMessage = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/sendMessage`,
  thunk: async payload => {
    const { data } = await restController.newMessage(payload);
    return data;
  },
});

const updateOrPushPreview = (previews, newPreview, newMessage) => {
  const updated = previews.map(preview =>
    preview._id === newPreview._id
      ? {
          ...preview,
          text: newMessage.body,
          sender: newMessage.sender,
          createdAt: newMessage.createdAt,
        }
      : preview
  );

  const exists = previews.some(p => p._id === newPreview._id);
  return exists ? updated : [...updated, newPreview];
};

const sendMessageExtraReducers = createExtraReducers({
  thunk: sendMessage,
  fulfilledReducer: (state, { payload }) => {
    const { preview, message } = payload;

    state.messagesPreview = updateOrPushPreview(
      state.messagesPreview,
      preview,
      message
    );

    if (state.chatData._id === preview._id) {
      state.chatData = {
        ...state.chatData,
        ...preview,
      };

      state.messages = [...state.messages, message];
    }

    state.error = null;
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- changeChatFavorite
export const changeChatFavorite = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeChatFavorite`,
  thunk: async payload => {
    const { data } = await restController.changeChatFavorite(payload);
    return data;
  },
});

const changeChatFavoriteExtraReducers = createExtraReducers({
  thunk: changeChatFavorite,
  fulfilledReducer: (state, { payload }) => {
    state.messagesPreview = state.messagesPreview.map(preview => {
      if (preview._id === payload._id) {
        return {
          ...preview,
          favoriteList: [...payload.favoriteList],
        };
      }
      return { ...preview };
    });

    state.chatData = {
      ...payload,
      favoriteList: [...payload.favoriteList],
    };
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- changeChatBlock
export const changeChatBlock = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeChatBlock`,
  thunk: async payload => {
    const { data } = await restController.changeChatBlock(payload);
    return data;
  },
});

const changeChatBlockExtraReducers = createExtraReducers({
  thunk: changeChatBlock,
  fulfilledReducer: (state, { payload }) => {
    state.messagesPreview = state.messagesPreview.map(preview => {
      if (preview._id === payload._id) {
        return {
          ...preview,
          blackList: [...payload.blackList],
        };
      }
      return { ...preview };
    });

    state.chatData = {
      ...payload,
      blackList: [...payload.blackList],
    };
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- getCatalogList
export const getCatalogList = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/getCatalogList`,
  thunk: async payload => {
    const { data } = await restController.getCatalogList(payload);
    return data;
  },
});

const getCatalogListExtraReducers = createExtraReducers({
  thunk: getCatalogList,
  fulfilledReducer: (state, { payload }) => {
    state.isFetching = false;
    state.catalogList = [...payload];
  },
  rejectedReducer,
});

//---------- addChatToCatalog
export const addChatToCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/addChatToCatalog`,
  thunk: async payload => {
    const { data } = await restController.addChatToCatalog(payload);
    return data;
  },
});

const addChatToCatalogExtraReducers = createExtraReducers({
  thunk: addChatToCatalog,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i]._id === payload._id) {
        catalogList[i].chats = payload.chats;
        break;
      }
    }
    state.isShowCatalogCreation = false;
    state.catalogList = [...catalogList];
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
    state.isShowCatalogCreation = false;
  },
});

//---------- createCatalog
export const createCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/createCatalog`,
  thunk: async payload => {
    const { data } = await restController.createCatalog(payload);
    return data;
  },
});

const createCatalogExtraReducers = createExtraReducers({
  thunk: createCatalog,
  fulfilledReducer: (state, { payload }) => {
    state.catalogList = [...state.catalogList, payload];
    state.isShowCatalogCreation = false;
  },
  rejectedReducer: (state, { payload }) => {
    state.isShowCatalogCreation = false;
    state.error = payload;
  },
});

//---------- deleteCatalog
export const deleteCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/deleteCatalog`,
  thunk: async payload => {
    await restController.deleteCatalog(payload);
    return payload;
  },
});

const deleteCatalogExtraReducers = createExtraReducers({
  thunk: deleteCatalog,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    const newCatalogList = remove(
      catalogList,
      catalog => payload.catalogId !== catalog._id
    );
    state.catalogList = [...newCatalogList];
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- removeChatFromCatalog
export const removeChatFromCatalog = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/removeChatFromCatalog`,
  thunk: async payload => {
    const { data } = await restController.removeChatFromCatalog(payload);
    return data;
  },
});

const removeChatFromCatalogExtraReducers = createExtraReducers({
  thunk: removeChatFromCatalog,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i]._id === payload._id) {
        catalogList[i].chats = payload.chats;
        break;
      }
    }
    state.currentCatalog = payload;
    state.catalogList = [...catalogList];
  },
  rejectedReducer: (state, { payload }) => {
    state.error = payload;
  },
});

//---------- changeCatalogName
export const changeCatalogName = decorateAsyncThunk({
  key: `${CHAT_SLICE_NAME}/changeCatalogName`,
  thunk: async payload => {
    const { data } = await restController.changeCatalogName(payload);
    return data;
  },
});

const changeCatalogNameExtraReducers = createExtraReducers({
  thunk: changeCatalogName,
  fulfilledReducer: (state, { payload }) => {
    const { catalogList } = state;
    for (let i = 0; i < catalogList.length; i++) {
      if (catalogList[i]._id === payload._id) {
        catalogList[i].catalogName = payload.catalogName;
        break;
      }
    }
    state.catalogList = [...catalogList];
    state.currentCatalog = payload;
    state.isRenameCatalog = false;
  },
  rejectedReducer: state => {
    state.isRenameCatalog = false;
  },
});
//-------------------------------------------------------
const normalizeParticipants = arr => [...arr].sort((a, b) => a - b);

const reducers = {
  changeBlockStatusInStore: (state, { payload }) => {
    const chatData = payload.chatData || payload;

    state.chatData = {
      ...state.chatData,
      ...chatData,
    };

    state.messagesPreview = state.messagesPreview.map(preview => {
      if (isEqual(preview.participants, chatData.participants)) {
        return {
          ...preview,
          blackList: chatData.blackList,
          favoriteList: chatData.favoriteList,
        };
      }
      return preview;
    });
  },

  addMessage: (state, { payload }) => {
    const { message, preview } = payload;
    let isNew = true;

    const msgParticipants = normalizeParticipants(message.participants);

    state.messagesPreview = state.messagesPreview.map(preview => {
      const previewParticipants = normalizeParticipants(preview.participants);
      if (isEqual(previewParticipants, msgParticipants)) {
        preview.text = message.body;
        preview.sender = message.sender;
        preview.createdAt = message.createdAt;
        isNew = false;
      }
      return preview;
    });

    if (isNew) {
      state.messagesPreview.push(preview);
    }

    if (state.chatData._id === message.conversation_id) {
      state.messages = [...state.messages, message];
    }
  },

  backToDialogList: state => {
    state.isExpanded = false;
  },

  goToExpandedDialog: (state, { payload }) => {
    state.interlocutor = { ...state.interlocutor, ...payload.interlocutor };
    state.chatData = payload.conversationData;
    state.isShow = true;
    state.isExpanded = true;
    state.messages = [];
  },

  clearMessageList: state => {
    state.messages = [];
  },

  changeChatShow: state => {
    state.isShowCatalogCreation = false;
    state.isShow = !state.isShow;
  },

  setPreviewChatMode: (state, { payload }) => {
    state.chatMode = payload;
  },

  changeShowModeCatalog: (state, { payload }) => {
    state.currentCatalog = { ...state.currentCatalog, ...payload };
    state.isShowChatsInCatalog = !state.isShowChatsInCatalog;
    state.isRenameCatalog = false;
  },

  changeTypeOfChatAdding: (state, { payload }) => {
    state.catalogCreationMode = payload;
  },

  changeShowAddChatToCatalogMenu: (state, { payload }) => {
    state.addChatId = payload;
    state.isShowCatalogCreation = !state.isShowCatalogCreation;
  },

  changeRenameCatalogMode: state => {
    state.isRenameCatalog = !state.isRenameCatalog;
  },

  clearChatError: state => {
    state.error = null;
  },
};

const extraReducers = builder => {
  getPreviewChatExtraReducers(builder);
  getDialogMessagesExtraReducers(builder);
  sendMessageExtraReducers(builder);
  changeChatFavoriteExtraReducers(builder);
  changeChatBlockExtraReducers(builder);
  getCatalogListExtraReducers(builder);
  addChatToCatalogExtraReducers(builder);
  createCatalogExtraReducers(builder);
  deleteCatalogExtraReducers(builder);
  removeChatFromCatalogExtraReducers(builder);
  changeCatalogNameExtraReducers(builder);
};

const chatSlice = createSlice({
  name: CHAT_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = chatSlice;

export const {
  changeBlockStatusInStore,
  addMessage,
  backToDialogList,
  goToExpandedDialog,
  clearMessageList,
  changeChatShow,
  setPreviewChatMode,
  changeShowModeCatalog,
  changeTypeOfChatAdding,
  changeShowAddChatToCatalogMenu,
  changeRenameCatalogMode,
  clearChatError,
} = actions;

export default reducer;
