/////////////////////////// WEB 3 INTEGRATION ///////////////////////////
const web3Integration = async () => {
    // TODO(esorey): add checks for correct network

    const WHITELIST_API_ENDPOINT = 'https://47a7fuoamh.execute-api.us-east-1.amazonaws.com/test/';
    const MINTING_CONTRACT_ADDRESS = '0x69654905Da2F3D5e517c930d5Bb7bB8b0cBbd4Ec';
    const MINTING_CONTRACT_ABI = [
        "function tokenURI(uint256 _tokenId) view returns (string)"
    ];
    const renderUI = (state) => {
        if (state.wallet) {
            if (isValidChain(state)) {
                loadRightNetworkUI(state);
                return;
            } else {
                loadWrongNetworkUI(state);
                return;
            }
        }
        loadNotConnectedUI(state);
    }

    const isValidChain = (state) => {
        return [
            '0x1',  // ETH mainnet
            '0x4'   // Rinkeby
        ].includes(state.chainId);
    }

    const handleConnectWallet = async () => {
        if (!this.disabled) {
            // Disable both buttons while connection is pending.
            $('#connectWalletHeaderButton').prop('disabled', true);
            $('#connectWalletBodyButton').prop('disabled', true);

            // Get the user's wallet address.
            provider.send('eth_requestAccounts').catch(err => {
                console.error(err);
                // Manually render because no state changed.
                renderUI(state);
            })
            // Check if user is whitelisted.
            // const whitelistProof = await getWhitelistProof(state.wallet);
            // // whitelistProof is an array, empty if not whitelisted, non-empty if whitelisted
            // if (whitelistProof.length !== 0) {
            //     alert("You're on the whitelist!");
            // } else {
            //     alert("You aren't on the whitelist...");
            // }
            // await contractInteraction();
        }
    }

    const getCrossmintHtml = () => {
        return `
        <crossmint-pay-button
            collectionTitle="SCT"
            collectionDescription="SCT"
            collectionPhoto="<COLLECTION_IMAGE_URL>"
            clientId="c56a2e9b-3a25-4759-a124-309446765c56"
            mintConfig='{"type":"erc-721","totalPrice":"0.05","count":"1"}'
            environment="staging"
        />
        `
    }

    const handleMint = async () => {
        // get the connected wallet
        // construct and send a tx to the contract
        console.log("handleMint()");
    }

    const loadNotConnectedUI = () => {
        console.log("loadNotConnectedUI()");
        // Set HB and BB text to "Connect Wallet"
        // Add Connect Wallet handler to both buttons
        $('#mintingSection').hide();
        $('#connectWalletHeaderButton').off('click');
        $('#connectWalletBodyButton').off('click');
        $('#connectWalletHeaderButton').prop('disabled', false);
        $('#connectWalletBodyButton').prop('disabled', false);
        $('#connectWalletHeaderButton').click(handleConnectWallet);
        $('#connectWalletBodyButton').click(handleConnectWallet);
        $('#crossmintButton').html(getCrossmintHtml);
    }

    const loadRightNetworkUI = () => {
        console.log("loadRightNetworkUI()");
        $('#connectWalletHeaderButton').off('click');
        $('#connectWalletBodyButton').off('click');
        $('#connectWalletHeaderButton').prop('disabled', false);
        $('#connectWalletBodyButton').prop('disabled', false);
        // Show the minting widget, display the user's address, hide the body button.
        $('#mintingSection').show();
        $('#connectWalletBodyButton').hide();
        const shortAddress = state.wallet.slice(0, 6) + '...' + state.wallet.slice(-4);
        $('#connectWalletHeaderButton').html(shortAddress);
    }

    const loadWrongNetworkUI = () => {
        console.log("loadWrongNetworkUI()");
        $('#mintingSection').hide();
        $('#connectWalletHeaderButton').off('click');
        $('#connectWalletBodyButton').off('click');
        $('#connectWalletHeaderButton').prop('disabled', false);
        $('#connectWalletBodyButton').prop('disabled', false);
    }

    const handleAccountsChanged = (accounts) => {
        console.log('accountsChanged!');
        state.wallet = accounts[0];
        renderUI(state);
    };

    const handleNetworkChanged = (_) => {
        console.log('');
        window.location.reload();
    };

    if (typeof window.ethereum === 'undefined') {
        alert('This page requires a Web3 connection. Please install Metamask or another provider.');
    }

    let provider = new ethers.providers.Web3Provider(window.ethereum);

    let state = {
        wallet : (await provider.send('eth_accounts', []))[0],
        chainId : await provider.send('eth_chainId', [])
    };

    renderUI(state);

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleNetworkChanged);


    // let provider;
    //
    // const contractInteraction = async () => {
    //     const contract = new ethers.Contract(MINTING_CONTRACT_ADDRESS, MINTING_CONTRACT_ABI, provider);
    //     console.log(await contract.tokenURI(0));
    // }
    // const walletLogin = async () => {
    //     provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const accounts = await provider.send('eth_requestAccounts', []);
    //     return accounts[0];
    // }
    //
    // const getWhitelistProof = async (address) => {
    //     const resp = await fetch(WHITELIST_API_ENDPOINT + address);
    //     return await resp.json();
    // }
    //
    //
    //
    // // Hide the minting widget initially.
    // $('#mintingSection').hide();
    //
    // // Wire up handlers.
    // $('#connectWalletHeaderButton').click(handleConnectWallet);
    // $('#connectWalletBodyButton').click(handleConnectWallet);
}
