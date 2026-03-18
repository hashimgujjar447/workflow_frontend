import { useLoginMutation } from "@/store/services/authApi";

const [login] = useLoginMutation();

const handleTest = async () => {
  const res = await login({
    email: "test@gmail.com",
    password: "123456",
  });

  console.log(res);
};

handleTest()