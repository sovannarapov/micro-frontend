<script setup>
  useHead({
    script: [{ src: '/js/ozws.js', type: 'text/javascript', defer: true, body: true }],
  });

  const props = defineProps({
    reportData: {
      type: Object,
      default: {},
    },
  });
  const config = useRuntimeConfig();
  const {
    public: { ENV },
  } = config;
  const currentEnv = ENV.toLowerCase();
  const ozReportData = reactive(props.reportData);
  const ozUrl = new URL(ozReportData.url);
  const ozReport = ozReportData?.report;
  const ozService = ozReportData?.ozservice;
  const viewerMode = ozReportData?.viewerMode;
  const ozJsonData = ozReportData?.jsondata;
  const ozOdiData = ozReportData?.odidata;
  const ozDelimiter = ozReportData?.delimiter;
  const ozTaildata = ozReportData?.taildata;
  const OZUtil = ref();
  const osBit = window.navigator.userAgent.includes('64') ? '64' : '';
  const ozBit = ref(osBit);
  const ozBits = reactive([
    { name: '64 Bit', value: '64' },
    { name: '32 Bit', value: '' },
  ]);
  const ozLang = ref('en_US');
  const ozLanguages = reactive([
    { name: 'ENG', value: 'en_US' },
    { name: 'KOR', value: 'ko_KR' },
  ]);
  const namespace = 'OZEXEViewer';
  const OZViewerID = 'OZViewerFdddF';

  const OZCustomButtonClickCommand_OZViewer = id => {
    console.log('버튼 id : ' + id);
  };

  const OZProgressCommand_OZViewer = (step, state, reportname) => {
    if (step == 4 && state == 2) {
      alert('progresscommand');
      //OZUtil.value.Script("disable_input_all");//입력컴포넌트 비활성화
    }
  };

  const OZPostCommand_OZViewer = (step, state) => {
    alert('1');
  };

  const OZPrintCommand_OZViewer = (
    msg,
    code,
    reportname,
    printername,
    printcopy,
    printpages,
    printrange,
    username,
    printerdrivername,
    printpagesrange,
  ) => {
    console.log('ozprintcommand');
    if (code == 0) {
      alert('프린트 결과 메시지 : ' + msg);
      alert('보고서 이름 : ' + reportname);
      alert('프린터 이름 : ' + printername);
      alert('인쇄 매수 : ' + printcopy);
      alert('인쇄된 용지 매수 : ' + printpages);
      alert('인쇄 범위 : ' + printrange);
      alert('사용자 이름 : ' + username);
      alert('프린터 드라이버 이름 : ' + printerdrivername);
      alert('인쇄된 페이지 범위 : ' + printpagesrange);
    }
  };

  const OZExportCommand_OZViewer = (code, path, filename, pagecount, filepaths) => {
    //alert("export 완료.");
  };

  const OZUserEvent_OZViewer = (arg1, arg2, arg3) => {
    //alert("export 완료." + arg1 + arg2 + arg3);
  };

  const OZExitCommand = () => {
    //alert("export 완료.");
  };

  const OZViewerLoaded_OZViewerID = () => {
    OZUtil.value.Script(OZViewerID, 'disable_input_all', function (retval) {
      alert(retval);
    });
  };

  const ZTInstallEndCommand = (arg1, arg2) => {
    let paramCnt = 0;
    let odiParamCnt = 0;
    let odiFilename = ozReport.substring(ozReport.lastIndexOf('/') + 1, ozReport.length);
    if (arg2.length === 0) {
      OZUtil.value.setParameter('connection.servlet', `${ozUrl.protocol}//${ozUrl.host}/oz/server`);
      OZUtil.value.setParameter('connection.reportname', `${ozReport}.ozr`);
      //odi 설정
      OZUtil.value.setParameter('odi.odinames', `${odiFilename}`);

      for (const [index, [key, value]] of Object.entries(Object.entries(ozOdiData))) {
        OZUtil.value.setParameter(
          'odi.' + `${odiFilename}.args${parseInt(index) + 1}`,
          `${key}=${JSON.stringify(value)}`,
        );
        odiParamCnt++;
        console.log('odi.' + `${odiFilename}.args${parseInt(index) + 1}`, `${key}=${JSON.stringify(value)}`);
      }
      OZUtil.value.setParameter('odi.' + `${odiFilename}.pcount`, odiParamCnt);

      OZUtil.value.setParameter('connection.fetchtype', 'concurrent'); // 데이터 모듈 생성과 전송 작업을 동시에 실행
      OZUtil.value.setParameter('connection.pageque', '500'); // 메모리에 로드할 페이지 수
      OZUtil.value.setParameter('connection.pagequebundle', '5'); // 한 파일로 저장되는 페이지 수
      OZUtil.value.setParameter('connection.serverdmtype', 'MEMORY'); // 서버의 데이터타입 MEMORY,FILE
      OZUtil.value.setParameter('connection.clientdmtype', 'MEMORY'); // 클라이언트 데이터타입 MEMORY,FILE
      OZUtil.value.setParameter('connection.compresseddatamodule', 'false'); // 데이터 압축여부
      OZUtil.value.setParameter('connection.compressedForm', 'false'); // 폼 압축여부

      if (ozService === 'loan') {
        OZUtil.value.setParameter('connection.args1', `jsondata=${JSON.stringify(ozJsonData)}`);
        OZUtil.value.setParameter('connection.args2', `taildata=${ozTaildata}`);
        OZUtil.value.setParameter('connection.args3', `delimiter=${ozDelimiter}`);
        paramCnt = 3;
        if (ozJsonData.titleData !== undefined) {
          OZUtil.value.setParameter('connection.args4', `titleData=${JSON.stringify(ozJsonData.titleData)}`);
          paramCnt++;
        }
      }

      if (ozService === 'info') {
        // OZUtil.value.setParameter('connection.args1', `jsondata=${JSON.stringify(ozJsonData)}`);
        for (const [index, [key, value]] of Object.entries(Object.entries(ozJsonData))) {
          OZUtil.value.setParameter(`connection.args${parseInt(index) + 1}`, `${key}=${JSON.stringify(value)}`);
          paramCnt++;
          console.log(`connection.args${parseInt(index) + 1}`, `${key}=${JSON.stringify(value)}`);
        }
      }

      console.log('viewerMode', viewerMode);
      OZUtil.value.setParameter('viewer.mode', viewerMode);

      if (viewerMode === 'print') {
        OZUtil.value.setParameter('print.mode', 'silent');
      }

      OZUtil.value.setParameter('global.language', ozLang.value);
      OZUtil.value.setParameter('viewer.ozresource_language', ozLang.value);
      OZUtil.value.setParameter('connection.pcount', paramCnt);
      OZUtil.value.setParameter('information.debug', 'true');
      OZUtil.value.setParameter('viewer.postcommand', 'true');
      //OZUtil.value.setParameter("viewer.showtree","true");
      OZUtil.value.setParameter('viewer.closeframe', 'true');
      OZUtil.value.setParameter('viewer.framewidth', 900);

      /*
    OZUtil.value.addEventListener("UserEvent", OZUserEvent_OZViewer,OZViewerID);
    OZUtil.value.addEventListener("OZProgressCommand", OZProgressCommand_OZViewer,OZViewerID);
    OZUtil.value.addEventListener("OZPrintCommand", OZPrintCommand_OZViewer,OZViewerID);
    OZUtil.value.addEventListener("OZExportCommand", OZExportCommand_OZViewer,OZViewerID);
    OZUtil.value.addEventListener("OZPostCommand", OZPostCommand_OZViewer,OZViewerID);
    OZUtil.value.addEventListener("OZCustomButtonClickCommand", OZCustomButtonClickCommand_OZViewer, OZViewerID);
    */
      console.log('OZUtil.value :' , OZUtil.value);
      const options = {};
      options['namespace'] = namespace;
      OZUtil.value.setOption(options);
      OZUtil.value.createViewer(OZViewerID, OZViewerLoaded_OZViewerID);
    } else {
      alert(arg2);
    }

    setTimeout(() => {
      closePopup('Report');
    }, 3000);
  };

  const installOZWebLauncher = () => {
    console.log('installOZWebLauncher ozUrl.port', ozUrl.port);
    console.log('installOZWebLauncher download url', `${ozUrl.protocol}//${ozUrl.hostname}/oz/ozexeviewer/ozrviewer${ozBit.value}/`);
    if (!OZUtil.value._isWaitInstall) {
      if (confirm('You need to install the Report Viewer program. Please install the program and try again.')) {
        downExe(`${ozUrl.origin}/oz/ozexeviewer/OnLine_Install_Dialog_UI_SSL.exe`);

        OZUtil.value._isWaitInstall = true;
        const protocolversion = 2019;
        const ztParam = new Object();
        ztParam.InstallBase = '<PROGRAMS>/Forcs';
        ztParam.InstallNamespace = namespace;
        ztParam.DownloadServer = `${ozUrl.protocol}//${ozUrl.hostname}/oz/ozexeviewer/ozrviewer${ozBit.value}/`;
        console.log('currentEnv', currentEnv);
        if(currentEnv==='prd'){
          ztParam.DownloadPort = 80;
        }else{
          ztParam.DownloadPort = ozUrl?.origin?.includes('https') ? 8443 : 8000;
        }
        ztParam.DownloadInstruction = 'ozrviewer.idf';
        console.log('ztParam.DownloadPort', ztParam.DownloadPort);
        OZUtil.value.installViewer(protocolversion, ztParam, installOZWebLauncher, ZTInstallEndCommand);
      }
    }
  };

  const OZCall = () => {
    console.log('OZCall ozUrl.port', ozUrl.port);
    console.log('OZCall download url', `${ozUrl.protocol}//${ozUrl.hostname}/oz/ozexeviewer/ozrviewer${ozBit.value}/`);
    const protocolversion = 2019;
    const ztParam = new Object();
    ztParam.InstallBase = '<PROGRAMS>/Forcs';
    ztParam.InstallNamespace = namespace;
    ztParam.DownloadServer = `${ozUrl.protocol}//${ozUrl.hostname}/oz/ozexeviewer/ozrviewer${ozBit.value}/`;
    console.log('currentEnv', currentEnv);
    if(currentEnv==='prd'){
      ztParam.DownloadPort = 80;
    }else{
      ztParam.DownloadPort = ozUrl?.origin?.includes('https') ? 8443 : 8000;
    }
    ztParam.DownloadInstruction = 'ozrviewer.idf';
    console.log('ztParam.DownloadPort', ztParam.DownloadPort);
    OZUtil.value.installViewer(protocolversion, ztParam, installOZWebLauncher, ZTInstallEndCommand);
  };

  const downExe = url => {
    document.getElementById('downfrm').src = url;
    //window.location = ;
  };

  const Document_TriggerExternalEvent = () => {
    OZUtil.value.Document_TriggerExternalEvent(OZViewerID, 'a1', 'a2', 'a3', 'a4', function (retval) {
      alert(retval);
    });
  };

  const GetInformataion = () => {
    OZUtil.value.Script(OZViewerID, 'disable_input_all', function (retval) {
      alert(retval);
    });
    /*OZUtil.value.ScriptEx(OZViewerID, "save_memorystream", "export.format=pdf;export.path=C:\\temp;export.mode=true;export.filename=basic.pdf;export.confirmsave=true",";", function(retval) {
                        alert(retval);
                });

*/
  };

  const SetGlobal = () => {
    OZUtil.value.Document_SetGlobal(OZViewerID, 'aaaa', 1000, 0, function (result) {
      alert(typeof result);
      alert('111' + result);
      //alert("전체 페이지 수 " + totalPage);
    });
  };

  const GetGlobal = () => {
    OZUtil.value.Document_GetGlobal(OZViewerID, 'aaa', 0, function (result) {
      alert(typeof result);
      alert('value: ' + result);

      OZUtil.value.Document_GetGlobal(OZViewerID, 'bbb', 0, function (result) {
        alert(typeof result);
        alert('value: ' + result);
      });
    });
  };

  const EndViewer1 = () => {
    OZUtil.value.CloseEXEViewer(OZViewerID);
  };

  onMounted(() => {
    const int = ref();

    int.value = window.setInterval(() => {
      if (typeof start_OZUtil !== 'undefined' && start_OZUtil) {
        OZUtil.value = start_OZUtil;

        window.clearInterval(int.value);
        int.value = null;

        OZCall();
      }
    }, 100);
  });
</script>
<template>
  <iframe id="downfrm" style="display: none"></iframe>

  <div>
    <b-form-select v-model="ozBit" :options="ozBits" value-field="value" text-field="name" style="width: 90px" />
    <b-form-select v-model="ozLang" :options="ozLanguages" value-field="value" text-field="name" style="width: 80px" />
    <input type="button" value="Download" @click="OZCall" />
  </div>

  <br />This is the OZ Viewer EXE WS Version page.<br />
  <br />1. Click the [RunViewer] button at the top.<br />
  <br />2. If you see the message [Installation required, please install the programme and try again] on first run,
  click Install the program. <br />
  <br />(If prompted by the firewall, allow it.) <br />3. After the program has finished installing, run step 1 again.
  <br />
  <br />4. This will launch the OZ viewer. <br />

  <div v-if="currentEnv === 'local' || currentEnv === 'dev'">
    <br />request.getRequestURL() : {{ ozUrl }} <br />
    <br />request.getRequestURI() : {{ ozUrl.pathname }} <br />
    <br />reportURL : {{ ozUrl.origin }} <br />
    <br />request.getServerName() : {{ ozUrl.host }} <br />
    <br />viewer mode : {{ viewerMode }} <br />
    <br />jsondata : {{ ozJsonData }} <br />
    <br />odidata : {{ ozOdiData }} <br />
    <p v-if="ozService === 'loan'">
      <span v-if="ozJsonData.titleData !== undefined"> <br />titleData : {{ ozJsonData.titleData }} <br /> </span>
      <br />delimiter : {{ ozDelimiter }} <br />
      <br />taildata : {{ ozTaildata }} <br />
    </p>
  </div>
</template>
