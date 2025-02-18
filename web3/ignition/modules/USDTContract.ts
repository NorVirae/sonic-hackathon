// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const USDTContractModule = buildModule("USDTContractModule", (m) => {
  // Black token
  // const name = m.getParameter("name", "Blackhards Token");
  // const symbol = m.getParameter("symbol", "BLACK");
  // const decimal = m.getParameter("decimal", 18);

  // USDT Token
  const name = m.getParameter("name", "USD Token");
  const symbol = m.getParameter("symbol", "USDT");
  const decimal = m.getParameter("decimal", 6);

  const initialSupply = m.getParameter("initialSupply", 10_000_000);



  const contract = m.contract("USDTContract", [name,
    symbol,
    initialSupply, decimal]);

  return { contract };
});

export default USDTContractModule;
