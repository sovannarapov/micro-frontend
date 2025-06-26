<script setup>
  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });

  const callGetApi = async () => {
    try {
      const result = await useDefaultFetch('/auth/healthCheck', {
        method: 'get',
        params: {},
      });

      if (result && result.resultCd === '0000') {
        console.log('result :: ', result);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const callPostApi = async () => {
    try {
      const result = await useDefaultFetch('/auth/healthCheck', {
        method: 'post',
        body: {},
      });

      if (result && result.resultCd === '0000') {
        console.log('result :: ', result);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const callGetFileApi = async () => {
    try {
      const result = await useDefaultFetch('/csm/downloadFile', {
        method: 'get',
        params: {
          defaultFilePath: '/channel_shareddata/',
          fileName: 'test.png',
          originalFileName: 'test.png',
          filePath: 'test',
        },
        responseType: 'blob',
      });

      const blob = new Blob([result.data], { type: 'image/png' });
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result;
        imageUrl.value = base64data;
      };
      reader.readAsDataURL(blob);
      // }
    } catch (e) {
      console.warn(e);
    }
  };

  const imageUrl = ref('');
  const callGetStaticFileApi = async () => {
    try {
      const result = await useTestFetch('/static/get-image3', {
        method: 'get',
        responseType: 'blob',
      });
      console.log('result', result);
      // if (result && result.resultCd === '0000') {
      const blob = new Blob([result], { type: 'image/png' });
      const reader = new FileReader();

      reader.onload = () => {
        const base64data = reader.result;
        console.log('base64data', base64data);
        imageUrl.value = base64data;
      };
      reader.readAsDataURL(blob);
      // }
    } catch (e) {
      console.warn(e);
    }
  };

  // fetch('http://localhost:3000/backend/csm/downloadFile?defaultFilePath=/channel_shareddata/test&fileName=test.png')
  //   .then(response => response.blob())
  //   .then(blob => {
  //     console.log('blobblob', blob);
  //     const url = URL.createObjectURL(blob);
  //     console.log('urlurl', url);
  //     for (const img of document.querySelectorAll('img')) img.src = url;
  //   });
</script>
<template>
  <div>
    <h1>Rest api</h1>
    <br />
    <h2><strong>Get</strong></h2>
    <br />
    <div>
      <b-button @click="callGetApi">call get api</b-button>
    </div>
    <br />
    <h2><strong>Post</strong></h2>
    <br />
    <div>
      <b-button @click="callPostApi">call post api</b-button>
    </div>
    <br />
    <h2><strong>File (Blob)</strong></h2>
    <br />
    <div>
      <b-button @click="callGetFileApi">call blob api</b-button>
    </div>
    <h2><strong>File (Blob)</strong></h2>
    <br />
    <!--<div>
      <b-button @click="callGetStaticFileApi">call blob api</b-button>
    </div>-->
    <img :src="imageUrl" />
  </div>
</template>
1
