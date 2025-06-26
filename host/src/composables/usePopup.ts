import { v4 as uuidv4 } from 'uuid';
import { useModal } from 'vue-final-modal';
import CommonPopup from '../components/common/popup/index.vue';

const defaultSetting = {
  component: CommonPopup,
  keepAlive: false,
  attrs: {
    title: 'Popup title',
    clickToClose: false,
  },
};

const createdIds: string[] = [];
const modalInstances = reactive({});

const clearPopup = () => {
  if (createdIds.length > 0) {
    for (const popup in modalInstances) {
      if (modalInstances.hasOwnProperty(popup)) {
        modalInstances[popup].destroy();
        delete modalInstances[popup];
      }
    }

    createdIds.splice(0);
  }
};

const closePopup = component => {
  for (const [index, [key]] of Object.entries(Object.entries(modalInstances))) {
    if (modalInstances.hasOwnProperty(key)) {
      if (modalInstances[key].options.attrs.component === component) {
        createdIds.splice(Number(index), 1);
        modalInstances[key].destroy();
        delete modalInstances[key];
      }
    }
  }
};

const usePopup = (options?) => {
  const closeModal = (param?, openerParam?) => {
    const lastId = createdIds[createdIds.length - 1];

    try {
      const {
        options: {
          attrs: { callback },
        },
      } = modalInstances[lastId];

      if (callback && typeof callback === 'function') {
        callback(param, openerParam);
      }
    } catch (e) {}

    modalInstances[lastId].destroy();
    delete modalInstances[lastId];
    createdIds.pop();
  };

  if (options) {
    const uid = uuidv4();
    const { width, height, title, component, titleButtons, callback, readOnly, datas, closeDatas } = options;

    if (!component) {
      console.error('Component parameter 누락');
      return false;
    }

    modalInstances[uid] = useModal({
      ...defaultSetting,
      keepAlive: false,
      attrs: {
        ...defaultSetting.attrs,
        title: title || 'title',
        width: width || 1000,
        height: height || 600,
        component,
        titleButtons,
        callback,
        readOnly,
        datas,
        // 레이어팝업 내 컨펌
        onConfirm(param) {
          closeModal(param, datas);
        },
        // 레이어팝업 내 닫기 버튼
        onClose(param) {
          closeModal(param, closeDatas);
        },
      },
    });

    createdIds.push(uid);
    modalInstances[uid].open();
  }
};

export { createdIds, modalInstances, clearPopup, closePopup, usePopup };
