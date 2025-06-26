<script setup>
  import Contents from '@/components/guide/popup/Empty.vue';
  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });

  // param : 레이어팝업에서 emit을 통해 전달해 주는 파라미터
  // openerParam : 부모창에서 설정한 파라미터
  const popupCallback = (param, openerParam) => {
    console.log('popupCallback', param, openerParam);
  };
  const onClickPopup0 = () => {
    const options = {
      title: 'test',
      width: '80%',
      height: '50%',
      component: 'CSM0031P01',
      datas: { test: 'test' },
      closeDatas: { closed: 'closed' },
      callback: popupCallback,
    };
    usePopup(options);
  };
  const onClickPopup1 = () => {
    const options = { title: 'test', component: 'CSM0032P01', callback: popupCallback };
    usePopup(options);
  };
  const onClickPopup2 = () => {
    const options = {
      title: 'test',
      width: 1200,
      height: 800,
      component: 'Sample', // * component 명은 필수값이며 다른 component명과 같으면 사용 불가합니다.
      datas: { test: 'test' }, // 레이어 팝업으로 전달할 파라미터
      closeDatas: { closed: 'closed' }, // 레이어 팝업 닫기 버튼 클릭 시 전달할 파라미터
      callback: popupCallback,
    };
    usePopup(options);
  };

  const onClickPopup3 = () => {
    const options = {
      title: 'Individual Credit Rating Status',
      width: 1400,
      height: 800,
      component: 'LNE2100M00',
      datas: { test: 'test' },
      closeDatas: { closed: 'closed' },
      callback: popupCallback,
    };
    usePopup(options);
  };

  const onClickPopup5 = () => {
    const options = {
      title: 'Individual Credit Rating Status',
      width: 1400,
      height: 800,
      component: 'CSM0002M00',
      titleButtons: ['exe', 'help'],
      datas: { test: 'test' },
      closeDatas: { closed: 'closed' },
      callback: popupCallback,
    };
    usePopup(options);
  };

  const eventBusTest = reactive({});
  const popupCallbackEventBus = (param, openerParam) => {
    // 레이어팝업에서 변경한 데이터 확인
    console.log('popupCallbackEventBus', param, openerParam, eventBusTest);
  };
  const onClickPopup4 = () => {
    const options = {
      title: 'Event Bus',
      width: 1400,
      height: 800,
      component: 'LNE2110P01',
      datas: { test: 'test' },
      closeDatas: { closed: 'closed' },
      callback: popupCallbackEventBus,
    };
    usePopup(options);
  };

  // 레이어팝업에서 변경되는 데이터 감지
  useEmitListen('LNE2110P01', param => {
    Object.assign(eventBusTest, param);
  });
  useEmitListen('lyPopup', param => {
    console.log('lyPopup', param);
  });
</script>
<template>
  <div>
    <h1>Layer Popup</h1>

    <div>
      <b-button variant="outline-primary" @click="onClickPopup0">Open popup0</b-button>
    </div>
    <br />
    <div>
      <b-button variant="outline-primary" @click="onClickPopup1">Open popup1</b-button>
    </div>

    <br />
    이중 팝업 및 닫기 버튼 파라미터 설정 유형<br /><br />
    <div>
      <b-button variant="outline-primary" @click="onClickPopup2">Open Double popup</b-button>
    </div>
    <br />
    본문용 컴포넌트 부모창 확인<br /><br />
    <div>
      <b-button variant="outline-primary" @click="onClickPopup3">본문 팝업</b-button>
      <br /><br />
      <Contents />
    </div>
    <br /><br />
    타이틀 버튼 (Exe, Help)<br /><br />
    <div>
      <b-button variant="outline-primary" @click="onClickPopup5">본문 팝업</b-button>
    </div>
    <br />
    Eventbus<br /><br />
    <div>
      <b-button variant="outline-primary" @click="onClickPopup4">Open popup - eventbus</b-button>
    </div>
  </div>
</template>
