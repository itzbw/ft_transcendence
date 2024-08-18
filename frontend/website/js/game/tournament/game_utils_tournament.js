import { saveGameResult } from "../game_utils.js"
import { handleMatchResult } from "./process_tournament.js"


function getWinner(playerOneName, playerOneScore, playerTwoName, playerTwoScore) {
	return (playerOneScore > playerTwoScore ? playerOneName : playerTwoName);
}

// handle the end of a tournament game
export async function handleEndGame(playerOneName,
							playerOneScore,
							playerTwoName,
							playerTwoScore,
							TournamentData) {
	await saveGameResult(playerOneName, playerOneScore, playerTwoName, playerTwoScore);
	const winner = getWinner(playerOneName, playerOneScore, playerTwoName, playerTwoScore);
	handleMatchResult(TournamentData, TournamentData.nextMatch, winner);
}