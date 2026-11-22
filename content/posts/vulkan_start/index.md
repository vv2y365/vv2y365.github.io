+++
date = '2026-11-22T09:51:15+08:00'
draft = false
title = 'Vulkan理解难点'

+++

这里记录下学习vulkan 遇到的各种难点 与本人的理解



# 梳理DrawFrame

对于初步学习Vulkan 它的**同步机制**是许多人遇到的第一个困难 因为其中的各种"并行" 咱的大脑处理不过来 😵 但困难总要解决 下面是简要理解draw一个Frame的过程

| cpu      |                                                              |      |
| :------- | :----------------------------------------------------------: | ---- |
| gpu      |                                                              |      |
| 呈现系统 | 既不是 CPU 程序 也不是 GPU 的渲染部分 而是第三个参与者: 操作系统窗口系统 + 显示驱动 +  显示硬件的组合 Vulkan 故意把它当成一个黑盒 |      |
|          |                                                              |      |

1.`fence` **一开始**为eSignaled(以便一开始就可以使用帧槽位) cpu开始动手工作

2.cpu向交换链申请一张图片(**图片可供使用时发出**`presentCompleteSemaphore` 申请成功后再手动重置`fence`改为无信号状态) 

处理资源 记录命令缓冲区后提交命令缓冲区 接着调用`presentKHR`(只是提交一个呈现**请求** 并不是cpu自己把图片显示到屏幕上) 于此同时cpu直接切换帧槽位(**等**`fence`设为eSignaled后重复步骤2.) 提交请求后同时呈现系统**干等着**gpu发出`renderFinishedSemaphore`**后**以便呈现图片

3.接收到`presentCompleteSemaphore` **gpu开始渲染** 渲染完后发出`renderFinishedSemaphore`**并**把**提交这帧时**所用槽位的`fence`设为eSignaled cpu此时已在另一个槽位工作 等它下次转回这个槽位 才会等待这个`fence`然后复用槽位资源重复步骤2

4.步骤2中cpu提交任务并且图像确认可用后gpu开始处理下个渲染任务 等**呈现系统**接收到`renderFinishedSemaphore`后呈现图片 就这样重复



三者并行 彼此只通过这三个同步对象交接 谁也不等谁的"全部完成"

```cpp
void drawFrame()
    {
        //等待上一帧完成
        auto fenceResult = device.waitForFences(*inFlightFences[frameIndex], vk::True, UINT64_MAX);
        if (fenceResult != vk::Result::eSuccess)
        {
            throw std::runtime_error("failed to wait for fence!");
        }

        //从交换链获取图片
        auto [result, imageIndex] = swapChain.acquireNextImage(UINT64_MAX, *presentCompleteSemaphores[frameIndex], nullptr);

        if (result == vk::Result::eErrorOutOfDateKHR)
        {
            recreateSwapChain();
            return;
        }
        if (result != vk::Result::eSuccess && result != vk::Result::eSuboptimalKHR)
        {
            //assert(result == vk::Result::eTimeout || result == vk::Result::eNotReady);
            throw std::runtime_error("failed to acquire swap chain image: " + vk::to_string(result));
        }
        //更新缓冲区
        updateUniformBuffer(frameIndex);
        //手动重置为无信号
        device.resetFences(*inFlightFences[frameIndex]); 

        graphicsCommandBuffers[frameIndex].reset();

        //记录命令缓冲区
        recordCommandBuffer(imageIndex);
        //提交命令缓冲区
        vk::PipelineStageFlags waitDestinationStageMask( vk::PipelineStageFlagBits::eColorAttachmentOutput );
        const vk::SubmitInfo   submitInfo{
            .waitSemaphoreCount   = 1,
            .pWaitSemaphores      = &*presentCompleteSemaphores[frameIndex],
            .pWaitDstStageMask    = &waitDestinationStageMask,
            .commandBufferCount   = 1,
            .pCommandBuffers      = &*graphicsCommandBuffers[frameIndex],
            .signalSemaphoreCount = 1,
            .pSignalSemaphores    = &*renderFinishedSemaphores[imageIndex]
        };
        graphicsQueue.submit(submitInfo, *inFlightFences[frameIndex]);

        //绘制帧的最后一步是将结果提交回交换链，以便最终显示在屏幕上
        const vk::PresentInfoKHR presentInfoKHR{
            .waitSemaphoreCount = 1,
            .pWaitSemaphores    = &*renderFinishedSemaphores[imageIndex],
            .swapchainCount     = 1,
            .pSwapchains        = &*swapChain,
            .pImageIndices      = &imageIndex,
            .pResults           = nullptr
        };
        result = graphicsQueue.presentKHR(presentInfoKHR);

        if (result == vk::Result::eSuboptimalKHR || (result == vk::Result::eErrorOutOfDateKHR) || windowOwner->wasResized())
        {
            windowOwner->resetResized();
            recreateSwapChain();
        }
        else
        {
            assert(result == vk::Result::eSuccess);
        }

        //推送到下一帧
        frameIndex = (frameIndex + 1) % MAX_FRAMES_IN_FLIGHT;
    }
```

# Next
> NOT END