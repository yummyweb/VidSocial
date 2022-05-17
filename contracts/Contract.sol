pragma solidity ^0.8.0;

contract Contract {
  uint public videoCount = 0;
  mapping(uint => Video) public videos;

  struct Video {
    uint id;
    string hash;
    string title;
    string issue;
    int likes;
    address author;
    uint256 time;
  }

  event VideoUploaded(
    uint id,
    string hash,
    string title,
    string issue,
    int likes,
    address author,
    uint256 time
  );

  constructor() public {

  }

  function uploadVideo(string memory _videoHash, string memory _title, string memory _issue) public {
    videoCount++;
    videos[videoCount] = Video(videoCount, _videoHash, _title, _issue, 0, msg.sender, block.timestamp);
    emit VideoUploaded(videoCount, _videoHash, _title, _issue, 0, msg.sender, block.timestamp);
  }

  function likeVideo(uint id) public {
    videos[id].likes++;
  }

  function getVideo(uint id) public returns(Video memory) {
    return videos[id];
  }

  function totalVideos() public returns(uint256) {
    return videoCount;
  }
}
