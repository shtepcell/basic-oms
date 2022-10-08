import React from "react";

import { Header } from "src/components/Header";
import { UsersTable } from "src/features/UsersTable";

const Page = () => {
  return (
    <>
      <Header />
      <UsersTable />
    </>
  );
};

export { Page as default };
