const { result } = require('lodash')
import { tokens } from './helper'
const Token = artifacts.require('./Token')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Token', ([deployer,reciever,exchange],value) => {
  const name = 'Mujee Token'
  const symbol = 'MJT'
  const decimals = '18'
  const totalSupply = '1000000000000000000000000'
  let token

  beforeEach(async () => {
    token = await Token.new()
  })

  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await token.name()
      result.should.equal(name)
    })

    it('tracks the symbol', async ()  => {
      const result = await token.symbol()
      result.should.equal(symbol)
    })

    it('tracks the decimals', async ()  => {
      const result = await token.decimals()
      result.toString().should.equal(decimals)
    })

    it('tracks the total supply', async ()  => {
      const result = await token.totalSupply()
      result.toString().should.equal(totalSupply)
    })

    it ("balces are good", async() =>{
      const result = await token.balanceOf(deployer)
      result.toString().should.equal(totalSupply)

    })
    
  })

  describe("sending tokens",()=>{
    let result
    let amount
    beforeEach( async ()=>{
      amount =tokens(100)
      await token.approve(exchange,amount,{from:deployer})
     


    })
    describe("success",async()=>{
      beforeEach(async()=>{
        result= await token.transferFrom(deployer,reciever,amount,{from:exchange})
      })
      it("transfer token balance", async()=>{
        let balanceOf
  
        balanceOf= await token.balanceOf(deployer);
        console.log("deployer balance before",balanceOf.toString())
        balanceOf= await token.balanceOf(reciever);
        console.log("reciever balance before",balanceOf.toString())
  
        await token.transfer(reciever,tokens(100),{from:deployer})
  
        balanceOf=await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokens(999800).toString())
        console.log("deployer balance after = ",balanceOf.toString())
        
        balanceOf=await token.balanceOf(reciever);
        balanceOf.toString().should.equal(tokens(200).toString())
        console.log("reciever balance after = ",balanceOf.toString())
        
      })
      it("emitting event calls", async()=>{
        const log =result.logs[0]
        // console.log(log)
        log.event.should.equal("Transfer")
        const event=log.args
        event._from.should.equal(deployer,"deployer is correct")
        event._to.should.equal(reciever,"reciever is correct")
        event._value.toString().should.equal(amount.toString(),"value is correct")
  
  
      })
      
    })

describe ("failure",async()=>{
  it("rejects insufficient balance",async()=>{
    let InvalidAmount=tokens(100000000);
    await token.transferFrom(deployer,reciever,InvalidAmount,{from:exchange}).should.be.rejectedWith("VM Exception while processing transaction: revert")
 
     InvalidAmount=tokens(10000);
    await token.transferFrom(reciever,deployer,InvalidAmount,{from:exchange}).should.be.rejectedWith("VM Exception while processing transaction: revert")
  
    
  })
  it("rejects invalid recpient",async()=>{
    let InvalidAdress="0x0"
    await token.transferFrom(reciever,InvalidAdress,10,{from:exchange}).should.be.rejectedWith("invalid address")//can also be do able with .rejected  only
  
  })
})


   


  })
  describe("approving tokens",async()=>{
    
    let amount;
    let result;
    beforeEach(async()=>{
      amount=tokens(100)
      result= await token.approve(exchange,amount,{from:deployer})
    })
    describe("success",async()=>{
    it("allocates an allowance for delegated token spending on exchange",async()=>{
       //deployer is the one who allowed to the exchange this is for test. it will return allowance value ex:allowance[0][0]=5000;
       const allowance=await token.allowance(deployer,exchange)
       allowance.toString().should.equal(amount.toString())
    })
    it("emitting an Approval event calls", async()=>{
      const log =result.logs[0]
      // console.log(log)
      log.event.should.equal("Approval")
      const event=log.args
      event._owner.should.equal(deployer,"owner is correct")
      event._exchange.should.equal(exchange,"exchange is correct")
      event._value.toString().should.equal(amount.toString(),"value is correct")


    })
  })
  describe("failure",async()=>{
    it("rejects invalid recpient",async()=>{
      let InvalidAdress="0x0"
      await token.approve(InvalidAdress,10,{from:deployer}).should.be.rejected//can also be do able with .rejected  only
    
    })
  })

  })


})
