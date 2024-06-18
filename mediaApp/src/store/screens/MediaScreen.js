import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { uploadMedia, fetchMedia } from '../store/slices/mediaSlice';

const MediaScreen = () => {
  const [media, setMedia] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userMedia = useSelector((state) => state.media.media);

  const handleCapture = () => {
    launchCamera({ mediaType: 'mixed' }, (response) => {
      if (response.didCancel || response.errorCode) return;
      setMedia(response.assets[0]);
    });
  };

  const handleUpload = () => {
    if (media) {
      const fileType = media.type.split('/')[0];
      dispatch(uploadMedia({ userId: user.uid, media: media.uri, fileType }));
    }
  };

  return (
    <View>
      <Button title="Capture Media" onPress={handleCapture} />
      {media && (
        <View>
          <Image source={{ uri: media.uri }} style={{ width: 200, height: 200 }} />
          <Button title="Upload" onPress={handleUpload} />
        </View>
      )}
      <Button title="View My Media" onPress={() => dispatch(fetchMedia(user.uid))} />
      {userMedia.map((mediaItem) => (
        <Image key={mediaItem._id} source={{ uri: `http://localhost:5000/${mediaItem.filePath}` }} style={{ width: 200, height: 200 }} />
      ))}
    </View>
  );
};

export default MediaScreen;
