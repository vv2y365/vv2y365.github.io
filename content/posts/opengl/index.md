+++
date = '2026-07-19T16:38:15+08:00'
draft = false
title = 'Opengl画三角'
+++


# opengl 画三角

设置顶点 -> 配置VAO VBO  -> 配置顶点着色器 片段着色器 -> 链接这几个个着色器 -> 绘制

```cpp
//设置顶点
    float firstTriangle[] = {
        -0.9f, -0.5f, 0.0f,  // left
        -0.0f, -0.5f, 0.0f,  // right
        -0.45f, 0.5f, 0.0f,  // top
    };
    float secondTriangle[] = {
        0.0f, -0.5f, 0.0f,  // left
        0.9f, -0.5f, 0.0f,  // right
        0.45f, 0.5f, 0.0f   // top
    };

//配置2个不同的VAO VBO
unsigned int VBOs[2], VAOs[2];
    glGenVertexArrays(2, VAOs);
    glGenBuffers(2, VBOs);
    
    glBindVertexArray(VAOs[0]);
    glBindBuffer(GL_ARRAY_BUFFER, VBOs[0]);
    glBufferData(GL_ARRAY_BUFFER, sizeof(firstTriangle), firstTriangle, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);	
    glEnableVertexAttribArray(0);
    
    glBindVertexArray(VAOs[1]);	
    glBindBuffer(GL_ARRAY_BUFFER, VBOs[1]);	
    glBufferData(GL_ARRAY_BUFFER, sizeof(secondTriangle), secondTriangle, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, (void*)0);
    glEnableVertexAttribArray(0);
    
//配置一个顶点着色器 2个不同颜色的片段着色器
    // Vertex Shader 顶点着色器
    const char* vertexSource =
    R"(
    #version 330 core
    layout(location = 0) in vec3 aPos;
    void main()
    {
        gl_Position = vec4(aPos,1.0);
    }
    )";

    // Fragment Shader 片段着色器
    const char* fragmentSource =
    R"(
    #version 330 core
    out vec4 FragColor;
    void main()
    {
        FragColor = vec4(1.0,0.5,0.2,1.0);
    }
    )";

    //片段着色器2
    const char* fragmentSource2 =
    R"(
    #version 330 core
    out vec4 FragColor;
    void main()
    {
        FragColor = vec4(0.2,0.2,0.5,1.0);
    }
    )";

    //创建顶点着色器并编译
    unsigned int vertexShader =
        glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(
        vertexShader,
        1,
        &vertexSource,
        nullptr
    );
    glCompileShader(vertexShader);

    //创建片段着色器并编译
    unsigned int fragmentShader =
        glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(
        fragmentShader,
        1,
        &fragmentSource,
        nullptr
    );
    glCompileShader(fragmentShader);

    //创建片段着色器2并编译
    unsigned int fragmentShader2 =
        glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(
        fragmentShader2,
        1,
        &fragmentSource2,
        nullptr
    );
    glCompileShader(fragmentShader2);
    
//2个片段着色器链接到同一个顶点着色器
    unsigned int shader = glCreateProgram();
    glAttachShader(shader, vertexShader);
    glAttachShader(shader, fragmentShader);
    glLinkProgram(shader);

    unsigned int shader2 = glCreateProgram();
    glAttachShader(shader2, vertexShader);
    glAttachShader(shader2, fragmentShader2);
    glLinkProgram(shader2);

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);
    glDeleteShader(fragmentShader2);
    
//loop
while (!glfwWindowShouldClose(window))
    {
        //清屏
        glClear(GL_COLOR_BUFFER_BIT);
        //绘制橙色三角形
        glUseProgram(shader);
        glBindVertexArray(VAOs[0]);
        // glPolygonMode(GL_FRONT_AND_BACK, GL_LINE); //线框模式
        glDrawArrays(GL_TRIANGLES, 0, 6);

        //绘制蓝色三角形
        glUseProgram(shader2);
        glBindVertexArray(VAOs[1]);
        glDrawArrays(GL_TRIANGLES, 0, 6);
        //glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

        glfwSwapBuffers(window);
        glfwPollEvents();
    }
    

```