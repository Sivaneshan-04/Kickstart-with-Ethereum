import { Button, Table } from "semantic-ui-react";

import web3 from "../ethereum/web3";
import CampaignInstance from "../ethereum/campaign";

const RequestRow = (props) => {

  const approveRequest = async () => {

    const campaign = CampaignInstance(props.address);

    const accounts = await web3.eth.getAccounts();
    try{
        await campaign.methods.approveRequest(props.id-1).send({
            from: accounts[0],
        });
    }catch(err){
        console.log(err.message);
    }
    
  };

  const finalizeRequest = async () => {
    const campaign = CampaignInstance(props.address);

    const accounts = await web3.eth.getAccounts();
    try{
        await campaign.methods.finalizeRequest(props.id-1).send({
            from: accounts[0],
        });
    }catch(err){
        console.log(err.message);
    }
  };

  const readyToFinalize = props.approvalCount >= (props.approverLength/2);

  return (
    <Table.Row disabled={props.complete} positive={readyToFinalize && !props.complete}>
      <Table.Cell>{props.id}</Table.Cell>
      <Table.Cell>{props.desc}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(props.value, "ether")}</Table.Cell>
      <Table.Cell>{props.reci}</Table.Cell>
      <Table.Cell>
        {props.approvalCount}/{props.approverLength}
      </Table.Cell>
      <Table.Cell>
        {!props.complete&& <Button color="green" onClick={approveRequest}>
          Approve
        </Button>}
      </Table.Cell>
      <Table.Cell>
        { !props.complete && <Button color="red" onClick={finalizeRequest}>
          Finalize
        </Button>}
      </Table.Cell>
    </Table.Row>
  );
};

export default RequestRow;
