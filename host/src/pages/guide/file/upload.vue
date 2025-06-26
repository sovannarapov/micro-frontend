<script setup>
  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });

  const popupCallback = param => {
    console.log('popup callback', param);
  };

  const openUploader = () => {
    const options = {
      title: 'File upload',
      width: 800,
      height: 500,
      component: 'File',
      datas: { idnfiNo: 'guide', fileGroup: 'Guide' },
      callback: popupCallback,
    };
    usePopup(options);
  };

  const openReadonlyUploader = () => {
    const options = {
      title: 'File upload',
      width: 800,
      height: 500,
      component: 'File',
      readOnly: true,
      datas: { idnfiNo: 'guide', fileGroup: 'Guide' },
      callback: popupCallback,
    };
    usePopup(options);
  };
</script>
<template>
  <div>
    <h1>File Upload Popup</h1>

    <div>
      <b-button variant="outline-primary" @click="openUploader">Open uploader</b-button>
    </div>
    <div>
      <b-button variant="outline-primary" @click="openReadonlyUploader">Open readonly uploader</b-button>
    </div>
    <br /><br />
    <div>
      * 팝업 기능<br /><br />
      실제 작동 샘플은 아래 페이지 참고 바랍니다<br /><br />
      <NuxtLink to="/csm/CSM0012M00">Notice</NuxtLink>
      <br /><br />
      <p>
        1. 상단 help 업로드<br />- 파라미터 두개 필수 fileGroup, id<br />- 팝업에서 파일 attach 후 업로드 완료<br />-
        업로드 완료된 파일은 팝업 창 내서 확인 가능<br />- 삭제, 다운로드 가능
      </p>
      <br />
      <p>
        2. 일반 업로드<br />- 최초에는 파라미터 없음<br />- 재업로드 시에도 파라미터 없음<br />- 팝업에서 파일 attach 후
        업로드 완료<br />- 업로드 완료 된 파일은 부모창에 파라미터로 전달<br />- 업로드 완료 후 팝업 창 닫힘<br />-
        업로드 완료 후 부모창에서 기존 업로드 된 파일 목록을 팝업창으로 전달<br />- 업로드 완료 된 파일 목록 팝업창에서
        삭제, 다운로드 가능<br />- 탭 이동 시 업로드 완료된 파일 유지<br />- execute 실행 시 업로드 파일 목록 제거
        안함<br />- inquiry 후 table row 클릭 시 전달받은 파라미터 팝업으로 전달
      </p>
    </div>
  </div>
</template>
