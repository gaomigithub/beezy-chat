import React, { useState, useRef, useEffect } from "react";
import { Space, Table, Button, Input, Modal, Form } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { IDepartment } from "../../type";

function Department() {
  const [data, setData] = useState<IDepartment[]>([]);
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [initValues, setInitValues] = useState({});
  //是否创建子部门
  const [isSub, setIsSub] = useState<boolean>(false);
  const formApiCurrent = useRef<any>(null);
  const columns = [
    {
      title: "部门名称",
      render: (text: any, record: IDepartment) => {
        return record.name;
      },
    },
    {
      title: "父部门ID",
      dataIndex: "parent_department_id",
    },
    {
      title: "部门ID",
      dataIndex: "department_id",
    },
    {
      title: "操作",
      render: (text: any, record: IDepartment) => {
        return (
          <Button
            onClick={() => {
              setModalVisable(true);
              setIsEdit(true);
              setInitValues(record);
              setIsSub(record.isSub === "yes" ? true : false);
            }}
          >
            编辑
          </Button>
        );
      },
    },
  ];
  const handleSearch = async (searchName: string) => {
    const localData = JSON.parse(localStorage.getItem("departments")!);
    if (searchName && searchName !== "") {
      const filterData = localData?.filter((item: { name: string | any[] }) =>
        item.name.includes(searchName)
      );
      setData(filterData);
    } else {
      if (localData) {
        setData(localData);
      }
    }
  };
  const submit = () => {
    formApiCurrent.current
      .validate()
      .then((values: { name: string }) => {
        if (isEdit) {
          const filterData = data.filter((item) => item.name !== values.name);
          localStorage.setItem(
            "departments",
            JSON.stringify([...filterData, values])
          );
        } else {
          localStorage.setItem(
            "departments",
            JSON.stringify([...data, values])
          );
        }
        setModalVisable(false);
      })
      .catch((errors: any) => {
        console.log(errors);
      });
  };
  useEffect(() => {
    const localData = localStorage.getItem("departments");
    if (localData) {
      setData(JSON.parse(localData));
    }
  }, [modalVisable]);
  return (
    <>
      <Space style={{ margin: 10, marginLeft: 0 }}>
        <Input
          prefix={<IconSearch />}
          placeholder={"请输入部门名称"}
          onChange={(value) => handleSearch(value)}
        ></Input>
        <Button
          onClick={() => {
            setModalVisable(true);
            setInitValues({});
            setIsSub(false);
          }}
        >
          创建部门
        </Button>
      </Space>

      <Table columns={columns} dataSource={data} rowKey="department_id" />
      <Modal
        title={isEdit ? "编辑部门" : "创建部门"}
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
            label="部门名称"
            rules={[{ required: true }]}
          />
          <Form.RadioGroup
            field="isSub"
            label="是否创建为子部门"
            initValue={isSub ? "yes" : "no"}
            onChange={(e) => {
              if (e.target.value === "yes") {
                setIsSub(true);
              } else {
                setIsSub(false);
              }
            }}
          >
            <Form.Radio value="yes">是</Form.Radio>
            <Form.Radio value="no">否</Form.Radio>
          </Form.RadioGroup>
          {isSub && (
            <Form.Input
              field="parent_department_id"
              label="父部门ID"
              rules={[{ required: true }]}
            />
          )}
        </Form>
      </Modal>
    </>
  );
}

export default Department;
