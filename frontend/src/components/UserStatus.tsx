import { Trophy, Ticket } from "lucide-react"
import { useWallet } from "../hooks/useWallet"
import { useLottery } from "../hooks/useLottery"

export function UserStatus() {
  const { account, provider } = useWallet()
  const { players, userWinnings } = useLottery(provider)

  if (!account) return null

  const userTickets = players.filter((player) => player.toLowerCase() === account.toLowerCase()).length

  const totalWinnings = userWinnings.reduce((sum, win) => sum + Number.parseFloat(win.prize), 0)

  return (
    <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-4 rounded-lg shadow-md" style={{ background: 'linear-gradient(to right, #6b46c1, #805ad5)', color: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 p-2 rounded-full">
            {userWinnings.length > 0 ? <Trophy className="h-6 w-6" /> : <Ticket className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="font-semibold">
              {userWinnings.length > 0 ? "Congratulations, Winner! 🎉" : "Keep trying your luck!"}
            </h3>
            <p className="text-sm text-white/80">
              {userWinnings.length > 0
                ? `You've won ${userWinnings.length} time${userWinnings.length > 1 ? "s" : ""}!`
                : "You haven't won yet, but don't give up!"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/80">Current Tickets</p>
          <p className="font-bold">{userTickets}</p>
          {userWinnings.length > 0 && (
            <>
              <p className="text-sm text-white/80 mt-2">Total Winnings</p>
              <p className="font-bold">{totalWinnings.toFixed(4)} ETH</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
