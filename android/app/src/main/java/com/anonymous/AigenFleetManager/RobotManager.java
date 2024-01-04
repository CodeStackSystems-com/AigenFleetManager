package com.anonymous.AigenFleetManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.HashMap;
import android.util.Log;

import org.zeromq.ZContext;
import org.zeromq.ZMQ;
public class RobotManager extends ReactContextBaseJavaModule{

    ZContext context;
    ZMQ.Socket subscriber;

    private boolean isRunning = false;
    RobotManager(ReactApplicationContext context){
        super(context);
    }
    @Override
    public String getName() {
        return "RobotManager";
    }
    @ReactMethod
    public void getRobotHeartbeat(Promise promise){
        try{
            isRunning = true;
            context = new ZContext();
            subscriber = context.createSocket(ZMQ.SUB);
            subscriber.connect("tcp://18.118.149.207:5556");
            subscriber.subscribe("/robot/heartbeat");
            byte[] topic = subscriber.recv();
            String ss = new String(topic, StandardCharsets.UTF_8);
            promise.resolve(ss);
        }catch (Exception e){
            promise.reject("error", e);
        }
    }
}
