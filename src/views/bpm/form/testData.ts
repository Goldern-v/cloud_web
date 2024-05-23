export const mockDataList: any = {
  code: 200,
  data: {
    list: [
      {
        name: '云资源申请表单',
        status: 0,
        remark: '备注',
        id: 30,
        conf: '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
        fields: [
          '{"type":"select","field":"os_id","title":"资源池","info":"","effect":{"fetch":""},"options":[{"label":"私有云1","value":1},{"label":"私有云","value":2}],"_fc_drag_tag":"select","hidden":false,"display":true}',
          '{"type":"select","field":"Fpsc1nze6j4lvs","title":"资源类型","info":"","effect":{"fetch":""},"options":[{"label":"选项1","value":1},{"label":"选项2","value":2}],"_fc_drag_tag":"select","hidden":false,"display":true}',
          '{"type":"input","field":"Fg071nze6jxc2f","title":"资源名称","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
          '{"type":"input","field":"F3x21nze6m4jgl","title":"资源规格","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
          '{"type":"input","field":"Fphl1nze6mljvw","title":"价格","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
        ],
        createTime: 1692190861000
      },
      {
        name: '一级审批',
        status: 1,
        remark: '',
        id: 29,
        conf: '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":false,"innerText":"重置"}}',
        fields: [
          '{"type":"input","field":"F5dp5zxqrm97u","title":"名称","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
          '{"type":"input","field":"Fgn05zxqrse8v","title":"描述","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
          '{"type":"input","field":"Ffpy1nzdg7wpte","title":"类别","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
        ],
        createTime: 1692174958000
      },
      {
        name: '测试订单',
        status: 0,
        remark: '',
        id: 28,
        conf: '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
        fields: [
          '{"type":"input","field":"userId","title":"用户名","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
          '{"type":"input","field":"orderId","title":"订单号","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
          '{"type":"input","field":"favouers","title":"规格","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
          '{"type":"input","field":"price","title":"金额","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
          '{"type":"input","field":"Fs341nzh3hhdsv","title":"输入框","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
        ],
        createTime: 1692170428000
      },
      {
        name: '请假表单',
        status: 0,
        remark: '',
        id: 27,
        conf: '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
        fields: [
          '{"type":"datePicker","field":"F0e11nzd8fob9c","title":"开始时间","info":"","_fc_drag_tag":"datePicker","hidden":false,"display":true,"$required":""}',
          '{"type":"datePicker","field":"Fxu01nzd8gip8r","title":"结束时间","info":"","_fc_drag_tag":"datePicker","hidden":false,"display":true,"$required":""}',
          '{"type":"select","field":"Ft5b1nzd8k55xk","title":"请假类型","info":"","effect":{"fetch":""},"options":[{"label":"事假","value":1},{"label":"病假","value":2}],"_fc_drag_tag":"select","hidden":false,"display":true,"$required":""}',
          '{"type":"input","field":"Fwy71nzd8lyy2h","title":"请假原因","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
        ],
        createTime: 1692170308000
      }
    ],
    total: 4
  },
  msg: ''
}

export const mockDataDetail: any = {
  code: 200,
  data: {
    name: '云资源申请表单',
    status: 0,
    remark: '',
    id: 30,
    conf: '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
    fields: [
      '{"type":"select","field":"os_id","title":"资源池","info":"","effect":{"fetch":""},"options":[{"label":"私有云1","value":1},{"label":"私有云","value":2}],"_fc_drag_tag":"select","hidden":false,"display":true}',
      '{"type":"select","field":"Fpsc1nze6j4lvs","title":"资源类型","info":"","effect":{"fetch":""},"options":[{"label":"选项1","value":1},{"label":"选项2","value":2}],"_fc_drag_tag":"select","hidden":false,"display":true}',
      '{"type":"input","field":"Fg071nze6jxc2f","title":"资源名称","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
      '{"type":"input","field":"F3x21nze6m4jgl","title":"资源规格","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
      '{"type":"input","field":"Fphl1nze6mljvw","title":"价格","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
    ],
    createTime: 1692190861000
  },
  msg: ''
}

export const mockProcess: any = {
  code: 0,
  data: {
    list: [
      {
        id: 'f46d6be3-42f0-11ee-8f56-0242ac110004',
        name: '请假流程',
        processDefinitionId: 'qingjia:3:47891371-3c06-11ee-b61b-0242ac110003',
        category: '1',
        status: 1,
        result: 1,
        createTime: 1692931316000,
        endTime: null,
        tasks: [
          {
            id: 'f46e564f-42f0-11ee-8f56-0242ac110004',
            name: '部门领导审批'
          }
        ]
      }
    ],
    total: 1
  },
  msg: ''
}

export const mockProcessList = {
  code: 0,
  data: [
    {
      id: 'qingjia:3:47891371-3c06-11ee-b61b-0242ac110003',
      version: 3,
      name: '请假流程',
      description: null,
      category: '1',
      formType: 10,
      formId: 27,
      formConf:
        '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
      formFields: [
        '{"type":"datePicker","field":"F0e11nzd8fob9c","title":"开始时间","info":"","_fc_drag_tag":"datePicker","hidden":false,"display":true,"$required":""}',
        '{"type":"datePicker","field":"Fxu01nzd8gip8r","title":"结束时间","info":"","_fc_drag_tag":"datePicker","hidden":false,"display":true,"$required":""}',
        '{"type":"select","field":"Ft5b1nzd8k55xk","title":"请假类型","info":"","effect":{"fetch":""},"options":[{"label":"事假","value":1},{"label":"病假","value":2}],"_fc_drag_tag":"select","hidden":false,"display":true,"$required":""}',
        '{"type":"input","field":"Fwy71nzd8lyy2h","title":"请假原因","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
      ],
      formCustomCreatePath: null,
      formCustomViewPath: null,
      suspensionState: 1
    },
    {
      id: 'test-ni:1:d0496641-4242-11ee-8f56-0242ac110004',
      version: 1,
      name: '流程测试',
      description: null,
      category: '1',
      formType: 10,
      formId: 29,
      formConf:
        '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
      formFields: [
        '{"type":"input","field":"F5dp5zxqrm97u","title":"名称","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
        '{"type":"input","field":"Fgn05zxqrse8v","title":"描述","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
        '{"type":"input","field":"Ffpy1nzdg7wpte","title":"类别","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
      ],
      formCustomCreatePath: null,
      formCustomViewPath: null,
      suspensionState: 1
    },
    {
      id: 'test_lls_flow:5:d173aece-3dad-11ee-a445-0242ac110003',
      version: 5,
      name: '测试流程lls',
      description: null,
      category: '1',
      formType: 10,
      formId: 28,
      formConf:
        '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
      formFields: [
        '{"type":"input","field":"userId","title":"用户名","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
        '{"type":"input","field":"orderId","title":"订单号","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
        '{"type":"input","field":"favouers","title":"规格","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
        '{"type":"input","field":"price","title":"金额","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
        '{"type":"input","field":"Fs341nzh3hhdsv","title":"输入框","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
      ],
      formCustomCreatePath: null,
      formCustomViewPath: null,
      suspensionState: 1
    }
  ],
  msg: ''
}

export const mockApproveLog = {
  code: 200,
  data: [
    {
      id: '27bd7b54-463e-11ee-8f56-0242ac110004',
      name: 'hr',
      claimTime: null,
      createTime: 1693294326000,
      suspensionState: null,
      processInstance: {
        id: '78017ea6-463c-11ee-8f56-0242ac110004',
        name: '测试-hr-model',
        startUserId: 129,
        startUserNickname: '吴伟明',
        processDefinitionId: 'hrmodel:2:8c2fee1f-463b-11ee-8f56-0242ac110004'
      },
      endTime: null,
      durationInMillis: null,
      result: 1,
      reason: null,
      definitionKey: 'Activity_0mmd0do',
      assigneeUser: {
        id: 129,
        nickname: '吴伟明',
        deptId: 100,
        deptName: '芋道源码'
      }
    },
    {
      id: '7802690e-463c-11ee-8f56-0242ac110004',
      name: '部门',
      claimTime: null,
      createTime: 1693293602000,
      suspensionState: null,
      processInstance: {
        id: '78017ea6-463c-11ee-8f56-0242ac110004',
        name: '测试-hr-model',
        startUserId: 129,
        startUserNickname: '吴伟明',
        processDefinitionId: 'hrmodel:2:8c2fee1f-463b-11ee-8f56-0242ac110004'
      },
      endTime: 1693294326000,
      durationInMillis: 724319,
      result: 2,
      reason: '2121',
      definitionKey: 'Activity_17tvzof',
      assigneeUser: {
        id: 129,
        nickname: '吴伟明',
        deptId: 100,
        deptName: '芋道源码'
      }
    }
  ],
  msg: ''
}
export const mockModelList = {
  code: 0,
  data: [
    {
      key: 'Event_05t2ghe',
      type: 'startEvent',
      startTime: 1692152772035,
      endTime: 1692152772036,
      taskId: null
    },
    {
      key: 'Flow_1myq23i',
      type: 'sequenceFlow',
      startTime: 1692152772036,
      endTime: 1692152772036,
      taskId: null
    },
    {
      key: 'Activity_1xvlpb0',
      type: 'userTask',
      startTime: 1692152772037,
      endTime: 1692208874416,
      taskId: '5278dfa6-3c1f-11ee-a445-0242ac110003'
    },
    {
      key: 'Flow_168yyro',
      type: 'sequenceFlow',
      startTime: 1692208874417,
      endTime: 1692208874417,
      taskId: null
    },
    {
      key: 'Activity_1w4fuha',
      type: 'userTask',
      startTime: 1692208874418,
      endTime: null,
      taskId: 'f21900a1-3ca1-11ee-a445-0242ac110003'
    }
  ],
  msg: ''
}

export const mockModelXML = {
  code: 0,
  data: '<?xml version="1.0" encoding="UTF-8"?>\n<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://flowable.org/bpmn" id="diagram_Process_1692170354560">\n  <process id="test_lls_flow" name="测试流程lls" isExecutable="true">\n    <startEvent id="Event_05t2ghe"></startEvent>\n    <userTask id="Activity_1xvlpb0" name="flow1"></userTask>\n    <userTask id="Activity_1w4fuha" name="flow2"></userTask>\n    <sequenceFlow id="Flow_1myq23i" sourceRef="Event_05t2ghe" targetRef="Activity_1xvlpb0"></sequenceFlow>\n    <sequenceFlow id="Flow_168yyro" sourceRef="Activity_1xvlpb0" targetRef="Activity_1w4fuha"></sequenceFlow>\n    <endEvent id="Event_1tnoreo"></endEvent>\n    <sequenceFlow id="Flow_1mil7wk" sourceRef="Activity_1w4fuha" targetRef="Event_1tnoreo"></sequenceFlow>\n  </process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_test_lls_flow">\n    <bpmndi:BPMNPlane bpmnElement="test_lls_flow" id="BPMNPlane_test_lls_flow">\n      <bpmndi:BPMNShape bpmnElement="Event_05t2ghe" id="BPMNShape_Event_05t2ghe">\n        <omgdc:Bounds height="36.0" width="36.0" x="102.0" y="222.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Activity_1xvlpb0" id="BPMNShape_Activity_1xvlpb0">\n        <omgdc:Bounds height="80.0" width="100.0" x="200.0" y="200.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Activity_1w4fuha" id="BPMNShape_Activity_1w4fuha">\n        <omgdc:Bounds height="80.0" width="100.0" x="390.0" y="200.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Event_1tnoreo" id="BPMNShape_Event_1tnoreo">\n        <omgdc:Bounds height="36.0" width="36.0" x="582.0" y="222.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge bpmnElement="Flow_1myq23i" id="BPMNEdge_Flow_1myq23i">\n        <omgdi:waypoint x="138.0" y="240.0"></omgdi:waypoint>\n        <omgdi:waypoint x="200.0" y="240.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge bpmnElement="Flow_168yyro" id="BPMNEdge_Flow_168yyro">\n        <omgdi:waypoint x="300.0" y="240.0"></omgdi:waypoint>\n        <omgdi:waypoint x="390.0" y="240.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge bpmnElement="Flow_1mil7wk" id="BPMNEdge_Flow_1mil7wk">\n        <omgdi:waypoint x="490.0" y="240.0"></omgdi:waypoint>\n        <omgdi:waypoint x="582.0" y="240.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</definitions>',
  msg: ''
}

export const mockApproveDetail = {
  code: 0,
  data: {
    id: '1480215b-460b-11ee-8f56-0242ac110004',
    name: '请假流程',
    category: '1',
    status: 1,
    result: 1,
    createTime: 1693272390000,
    endTime: null,
    formVariables: {
      F0e11nzd8fob9c: '2023-08-08',
      Fxu01nzd8gip8r: '2023-08-02',
      Ft5b1nzd8k55xk: 2,
      Fwy71nzd8lyy2h: 'fsfsd'
    },
    businessKey: null,
    startUser: {
      id: 129,
      nickname: '吴伟明',
      deptId: 100,
      deptName: '芋道源码'
    },
    processDefinition: {
      id: 'qingjia:3:47891371-3c06-11ee-b61b-0242ac110003',
      formType: 10,
      formId: 27,
      formConf:
        '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
      formFields: [
        '{"type":"datePicker","field":"F0e11nzd8fob9c","title":"开始时间","info":"","_fc_drag_tag":"datePicker","hidden":false,"display":true,"$required":""}',
        '{"type":"datePicker","field":"Fxu01nzd8gip8r","title":"结束时间","info":"","_fc_drag_tag":"datePicker","hidden":false,"display":true,"$required":""}',
        '{"type":"select","field":"Ft5b1nzd8k55xk","title":"请假类型","info":"","effect":{"fetch":""},"options":[{"label":"事假","value":1},{"label":"病假","value":2}],"_fc_drag_tag":"select","hidden":false,"display":true,"$required":""}',
        '{"type":"input","field":"Fwy71nzd8lyy2h","title":"请假原因","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
      ],
      formCustomCreatePath: null,
      formCustomViewPath: null,
      bpmnXml:
        '<?xml version="1.0" encoding="UTF-8"?>\n<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://flowable.org/bpmn" id="diagram_Process_1692170586774">\n  <process id="qingjia" name="请假流程" isExecutable="true">\n    <startEvent id="Event_1yk3moj"></startEvent>\n    <userTask id="Activity_0llp95r" name="部门领导审批"></userTask>\n    <sequenceFlow id="Flow_144kp3w" sourceRef="Event_1yk3moj" targetRef="Activity_0llp95r"></sequenceFlow>\n    <userTask id="Activity_0wopc5i" name="HR审批"></userTask>\n    <endEvent id="Event_05sjfaw"></endEvent>\n    <sequenceFlow id="Flow_0o23z2p" sourceRef="Activity_0llp95r" targetRef="Activity_0wopc5i"></sequenceFlow>\n    <sequenceFlow id="Flow_1dd9lxf" sourceRef="Activity_0wopc5i" targetRef="Event_05sjfaw"></sequenceFlow>\n  </process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_qingjia">\n    <bpmndi:BPMNPlane bpmnElement="qingjia" id="BPMNPlane_qingjia">\n      <bpmndi:BPMNShape bpmnElement="Event_1yk3moj" id="BPMNShape_Event_1yk3moj">\n        <omgdc:Bounds height="36.0" width="36.0" x="302.0" y="262.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Activity_0llp95r" id="BPMNShape_Activity_0llp95r">\n        <omgdc:Bounds height="80.0" width="100.0" x="460.0" y="240.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Activity_0wopc5i" id="BPMNShape_Activity_0wopc5i">\n        <omgdc:Bounds height="80.0" width="100.0" x="700.0" y="240.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Event_05sjfaw" id="BPMNShape_Event_05sjfaw">\n        <omgdc:Bounds height="36.0" width="36.0" x="962.0" y="262.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge bpmnElement="Flow_144kp3w" id="BPMNEdge_Flow_144kp3w">\n        <omgdi:waypoint x="338.0" y="280.0"></omgdi:waypoint>\n        <omgdi:waypoint x="460.0" y="280.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge bpmnElement="Flow_0o23z2p" id="BPMNEdge_Flow_0o23z2p">\n        <omgdi:waypoint x="560.0" y="280.0"></omgdi:waypoint>\n        <omgdi:waypoint x="700.0" y="280.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge bpmnElement="Flow_1dd9lxf" id="BPMNEdge_Flow_1dd9lxf">\n        <omgdi:waypoint x="800.0" y="280.0"></omgdi:waypoint>\n        <omgdi:waypoint x="962.0" y="280.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</definitions>'
    }
  },
  msg: ''
}

export const mockFormDetail = {
  code: 0,
  data: {
    id: 'e0b6b8c2-4242-11ee-8f56-0242ac110004',
    name: '流程测试',
    category: '1',
    status: 2,
    result: 3,
    createTime: 1692856550000,
    endTime: null,
    formVariables: {
      F5dp5zxqrm97u: '11',
      Fgn05zxqrse8v: '111',
      Ffpy1nzdg7wpte: '1111'
    },
    businessKey: null,
    startUser: {
      id: 128,
      nickname: '倪若兰',
      deptId: 100,
      deptName: '芋道源码'
    },
    conf: '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
    fields: [
      '{"type":"input","field":"F5dp5zxqrm97u","title":"名称","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
      '{"type":"input","field":"Fgn05zxqrse8v","title":"描述","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
      '{"type":"input","field":"Ffpy1nzdg7wpte","title":"类别","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
    ],
    processDefinition: {
      id: 'test-ni:1:d0496641-4242-11ee-8f56-0242ac110004',
      formType: 10,
      formId: 29,
      formConf:
        '{"form":{"labelPosition":"right","size":"small","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":true,"innerText":"重置"}}',
      formFields: [
        '{"type":"input","field":"F5dp5zxqrm97u","title":"名称","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
        '{"type":"input","field":"Fgn05zxqrse8v","title":"描述","info":"","_fc_drag_tag":"input","hidden":false,"display":true}',
        '{"type":"input","field":"Ffpy1nzdg7wpte","title":"类别","info":"","_fc_drag_tag":"input","hidden":false,"display":true}'
      ],
      formCustomCreatePath: null,
      formCustomViewPath: null,
      bpmnXml:
        '<?xml version="1.0" encoding="UTF-8"?>\n<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://flowable.org/bpmn" id="diagram_Process_1692856086086">\n  <process id="test-ni" name="流程测试" isExecutable="true">\n    <startEvent id="Event_19j8vnj"></startEvent>\n    <userTask id="Activity_15u6z68" name="项目管理员审批"></userTask>\n    <sequenceFlow id="Flow_02pygmg" sourceRef="Event_19j8vnj" targetRef="Activity_15u6z68"></sequenceFlow>\n    <endEvent id="Event_0dzwuos"></endEvent>\n    <sequenceFlow id="Flow_0ckoaid" sourceRef="Activity_15u6z68" targetRef="Event_0dzwuos"></sequenceFlow>\n  </process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_test-ni">\n    <bpmndi:BPMNPlane bpmnElement="test-ni" id="BPMNPlane_test-ni">\n      <bpmndi:BPMNShape bpmnElement="Activity_15u6z68" id="BPMNShape_Activity_15u6z68">\n        <omgdc:Bounds height="80.0" width="100.0" x="240.0" y="470.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Event_19j8vnj" id="BPMNShape_Event_19j8vnj">\n        <omgdc:Bounds height="36.0" width="36.0" x="132.0" y="492.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Event_0dzwuos" id="BPMNShape_Event_0dzwuos">\n        <omgdc:Bounds height="36.0" width="36.0" x="442.0" y="492.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge bpmnElement="Flow_02pygmg" id="BPMNEdge_Flow_02pygmg">\n        <omgdi:waypoint x="168.0" y="510.0"></omgdi:waypoint>\n        <omgdi:waypoint x="240.0" y="510.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge bpmnElement="Flow_0ckoaid" id="BPMNEdge_Flow_0ckoaid">\n        <omgdi:waypoint x="340.0" y="510.0"></omgdi:waypoint>\n        <omgdi:waypoint x="442.0" y="510.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</definitions>'
    }
  },
  msg: ''
}
