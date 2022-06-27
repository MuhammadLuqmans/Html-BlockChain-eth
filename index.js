import { Contract, ethers } from "./ethers.5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connect-btn")
const fundBtn = document.getElementById("fund-btn")
const BalanceBtn = document.getElementById("balance-btn")
const withdrawBtn = document.getElementById('withdraw-btn');

const connect = async () => {
    if (window.ethereum !== "undefined") {
        const account = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        console.log("account", account, "connected!")
        const btnTitle = document.getElementById("connect-btn")
        btnTitle.innerHTML = "Connected :)"
    } else {
        console.log("you need to install metamask extension in your browser")
    }
}

// console.log(ethers)
const fund = async () => {
    const ethAmount = document.getElementById("fund-amount").value
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await LisnForTransactionMin(transactionResponse, provider)
            console.log("Done ! ")
        } catch (error) {
            console.log(error)
        }
    }
}

const LisnForTransactionMin = (transactionResponse, provider) => {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionResponse) => {
            console.log(
                `complete with ${transactionResponse.confirmation} confirmation`
            )
            resolve()
        })
    })
}

const GetBalance = async () => {
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        const balanceAmount = ethers.utils.formatEther(balance)
        console.log(balanceAmount)
    }
}

const Withdraw = async () => {
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.withdraw()
            await LisnForTransactionMin(transactionResponse, provider)
            console.log('complete withdraw')
        }catch(err){
            console.log(err)
        }
    }
}


connectBtn.onclick = connect
fundBtn.onclick = fund
BalanceBtn.onclick = GetBalance

withdrawBtn.onclick = Withdraw