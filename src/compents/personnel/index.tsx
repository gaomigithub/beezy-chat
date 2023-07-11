import React, { useState, useEffect, useRef } from "react";
import { Space, Table, Button, Modal, Form } from "@douyinfe/semi-ui";
import { Ipersonnel, EmployeeTypeEnum } from "../../type";
function Personnel() {
  const [data, setData] = useState<Ipersonnel[]>([
    {
      name: "员工1",
      mobile: "12345678901",
      department_ids: ["D067"],
      employee_type: 1,
    },
  ]);
  const employeeSelect = [
    { value: EmployeeTypeEnum.formal, label: "正式" },
    { value: EmployeeTypeEnum.intern, label: "实习" },
  ];
  const employText = {
    [EmployeeTypeEnum.formal]: "正式",
    [EmployeeTypeEnum.intern]: "实习",
  };
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [initValues, setInitValues] = useState({});
  const formApiCurrent = useRef<any>(null);
  const columns = [
    {
      title: "员工姓名",
      render: (text: any, record: Ipersonnel) => {
        return record.name;
      },
    },
    {
      title: "联系方式",
      dataIndex: "mobile",
    },
    {
      title: "所属部门",
      render: (text: any, record: Ipersonnel) => {
        return record.department_ids.join(",");
      },
    },
    {
      title: "人员类型",
      render: (text: any, record: Ipersonnel) => {
        return employText[record.employee_type];
      },
    },
    {
      title: "操作",
      render: (text: any, record: Ipersonnel) => {
        return (
          <Space>
            <Button>请假</Button>
            <Button>加班</Button>
            <Button
              type="danger"
              onClick={() => {
                const filterData =
                  data.filter((item) => item.name !== record.name) || data;
                setData(filterData);
                localStorage.setItem("Ipersonnel", JSON.stringify(filterData));
              }}
            >
              删除人员
            </Button>
          </Space>
        );
      },
    },
  ];
  const submit = () => {
    formApiCurrent.current
      .validate()
      .then((values: { department_ids: string }) => {
        localStorage.setItem(
          "Ipersonnel",
          JSON.stringify([
            ...data,
            { ...values, department_ids: values.department_ids.split(",") },
          ])
        );

        setModalVisable(false);
      })
      .catch((errors: any) => {
        console.log(errors);
      });
  };
  useEffect(() => {
    const localData = localStorage.getItem("Ipersonnel");
    if (localData) {
      setData(JSON.parse(localData));
    }
  }, [modalVisable]);
  return (
    <>
      <Space style={{ margin: 10, marginLeft: 0 }}>
        <Button
          onClick={() => {
            setModalVisable(true);
            setInitValues({});
          }}
        >
          添加人员
        </Button>
      </Space>

      <Table columns={columns} dataSource={data} rowKey="department_id" />
      <Modal
        title={"添加人员"}
        visible={modalVisable}
        onCancel={() => setModalVisable(false)}
        onOk={submit}
      >
        <Form
          getFormApi={(formApi) => (formApiCurrent.current = formApi)}
          initValues={initValues}
        >
          <Form.Input
            field="name"
            label="员工名称"
            rules={[{ required: true }]}
          />
          <Form.Input
            field="mobile"
            label="联系方式"
            rules={[{ required: true }]}
          />
          <Form.Input
            field="department_ids"
            label="所属部门"
            placeholder={"请输入部门ID,用,连接"}
            rules={[{ required: true }]}
          />
          <Form.Select
            initValue={EmployeeTypeEnum.formal}
            field="employee_type"
            label="人员类型"
            optionList={employeeSelect}
            style={{ width: "100%" }}
            rules={[{ required: true }]}
          ></Form.Select>
        </Form>
      </Modal>
    </>
  );
}

export default Personnel;
