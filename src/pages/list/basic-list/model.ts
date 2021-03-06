/*
 * @Description: Description
 * @Author: hayato
 * @Date: 2020-03-17 23:03:08
 * @LastEditors: hayato
 * @LastEditTime: 2020-11-09 20:10:24
 */
import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryQuotationsList, postQuotation, putQuotation, deleteQuotation } from './service';

import { BasicListItemDataType } from './data.d';

export interface StateType {
  list: BasicListItemDataType[];
  total: number;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
    edit: Effect;
    delete: Effect;
    search: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listAndbasicList',

  state: {
    list: [],
    total: 0
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryQuotationsList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.results) ? response : [],
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(queryQuotationsList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.results) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryQuotationsList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call }) {
      console.log('submit: ', payload)
      yield call(postQuotation, payload);
    },
    *edit({ payload }, { call }) {
      yield call(putQuotation, payload);
    },
    *delete({ payload }, { call, put }) {
      yield call(deleteQuotation, payload);

      yield put({type: 'fetch', payload})

    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload.results,
        total: action.payload.count
      };
    },
    appendList(state = { list: [], total: 0 }, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    }
  },
};

export default Model;
