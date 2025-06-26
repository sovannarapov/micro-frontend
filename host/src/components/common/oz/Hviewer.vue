<script setup>
const props = defineProps({
  reportData: {
    type: Object,
    default: {},
  },
});

const ozReportData = reactive(props.reportData);
const ozUrl = new URL(ozReportData.url);
const ozReport = ozReportData?.report;
const ozService = ozReportData?.ozservice;
const ozJsonData = ozReportData?.jsondata;
const ozDelimiter = ozReportData?.delimiter;
const c = ozReportData?.taildata;

const ReBind = () => {
  const val = document.querySelector('#testValue').value;
  const param =
    'odi.odinames=sample;odi.sample.pcount=2;odi.sample.args1=dbAlias=example;odi.sample.args2=odiparam=' + val;
  OZViewer.ReBind(0, 'data', param, ';');
};

const Export = () => {
  alert(1);
  OZViewer.ScriptEx('save', 'export.applyformat=xls;excel.filename=sample123456789.xls', ';');
};

const OZExportCommand_OZViewer = (code, path, filename, pagecount, filepaths) => {
  if (code == '1') {
    alert('페이지 수 : ' + pagecount);
  }
};

const SetOZParamters_OZViewer = () => {
  let oz;
  oz = document.getElementById('OZViewer');
  oz.sendToActionScript('connection.servlet', '/oz/server');
  oz.sendToActionScript('connection.reportname', `${ozReport}.ozr`);
  //oz.sendToActionScript("connection.reportname","Calendar.ozr");
  oz.sendToActionScript('connection.pcount', '2');
  oz.sendToActionScript('connection.args1', `jsondata=${ozJsonData}`);
  oz.sendToActionScript('connection.args2', `taildata=${ozTaildata}`);
  oz.sendToActionScript('connection.args3', `delimiter=${ozDelimiter}`);
  oz.sendToActionScript('information.debug', 'true');
  //oz.sendToActionScript("odi.odinames", "sample");
  //oz.sendToActionScript("odi.sample.pcount", "2");
  //oz.sendToActionScript("odi.sample.args1", "dbAlias=example");
  //oz.sendToActionScript("odi.sample.args2", "odiparam=");

  //pdf 저장시 폰트포함
  oz.sendToActionScript('pdf.fontembedding', 'true');
  oz.sendToActionScript('pdf.fontembedding_subset', 'true');

  //저장 이벤트 발생
  oz.sendToActionScript('viewer.exportcommand', 'true');

  return true;
};

onMounted(() => {
  const int = ref();

  int.value = window.setInterval(() => {
    if ($.ui && typeof start_ozjs !== 'undefined' && start_ozjs) {
      const opt = [];
      //opt["use_jquery_input_pc"] = true;  // DateTimePicker와 NumericUpDown UI를 jQuery에서 지원하는 UI로 사용
      //opt["save_exportfrom"] = { "pdf" : "server" }; //혹은 opt["save_exportfrom"] = { "pdf" : "scheduler" };
      //opt["print_exportfrom"] = "server"; //인쇄 PDF 익스포트 작업을 서버와 통신하여 동작
      //opt["rendering_mode"] = "svg"; //보고서 화면 렌더링 방식이 Canvas 가 아닌, SVG 형태로 그릴 경우에 사용
      //      opt["user_defined_function"] = {"save" : Export}; //저장버튼 클릭시 사용자 정의함수 실행

      // start_ozjs('OZViewer', '/oz/ozhviewer/');

      start_ozjs('OZViewer', '/oz/ozhviewer/', opt);

      window.clearInterval(int.value);
      int.value = null;
    }
  }, 100);
});
</script>
<template>
  <div>
    <input type="text" id="testValue" />
    <b-button @click="ReBind">ReBind</b-button>
    <input type="button" id="exportBtn" value="Export" />
  </div>
  <div id="OZViewer"></div>
</template>
