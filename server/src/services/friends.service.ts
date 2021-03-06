import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FriendRequestType } from "../schemas/friendRequest.chema";
import { FriendshipType } from "../schemas/friendship.schema";
import UsersService from "./users.service";
import { Model } from "mongoose";

@Injectable()
export default class FriendsService {
	constructor(
		@InjectModel("FriendRequest")
		readonly friendRequestModel: Model<FriendRequestType>,
		@InjectModel("Friendship") readonly friendshipModel: Model<FriendshipType>,
		readonly usersService: UsersService
	) {}
	async getUserFriends(userId: string) {
		const friendships = await this.friendshipModel
			.find({
				users: { $all: [userId] },
			})
			.populate([{ path: "users", model: "User", select: "-password -photo" }]);

		return friendships.map(friendship => {
			return friendship.users.find(
				(user: any) => String(user.id) !== String(userId)
			);
		});
	}

	isPartOfFriendRequest(userId: string, friendRequest: FriendRequestType) {
		return (
			String(friendRequest.from) === userId ||
			String(friendRequest.to) === userId
		);
	}

	isFriedRequestRecepient(userId: string, friendRequest: FriendRequestType) {
		return String(friendRequest.to) === userId;
	}
}
