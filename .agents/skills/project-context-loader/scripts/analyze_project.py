#!/usr/bin/env python3
"""
项目分析脚本 - 帮助 Agent 快速了解项目结构
用法: python3 analyze_project.py [项目根目录]
"""

import os
import sys
import json
from pathlib import Path

# 项目类型标识文件
PROJECT_TYPES = {
    "node": ["package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml"],
    "python": ["requirements.txt", "pyproject.toml", "setup.py", "Pipfile", "poetry.lock"],
    "go": ["go.mod", "go.sum"],
    "rust": ["Cargo.toml", "Cargo.lock"],
    "java": ["pom.xml", "build.gradle", "build.gradle.kts"],
    "docker": ["Dockerfile", "docker-compose.yml", "docker-compose.yaml"],
}

# 常见目录结构
COMMON_DIRS = {
    "source": ["src", "lib", "app", "bin", "cmd", "pkg", "internal"],
    "test": ["tests", "test", "__tests__", "spec", "e2e"],
    "docs": ["docs", "doc", "documentation", "wiki"],
    "config": ["config", "conf", "configuration", "settings"],
    "assets": ["assets", "static", "public", "resources", "media"],
}

# 重要配置文件
CONFIG_FILES = [
    ".gitignore",
    ".editorconfig",
    ".eslintrc",
    ".prettierrc",
    "tsconfig.json",
    "jest.config.js",
    "vite.config.js",
    "webpack.config.js",
    "tailwind.config.js",
    "pyproject.toml",
    "setup.cfg",
    "tox.ini",
    "pytest.ini",
    ".github/workflows",
]


def detect_project_type(root_dir: Path) -> list:
    """检测项目类型"""
    detected = []
    for ptype, markers in PROJECT_TYPES.items():
        for marker in markers:
            if (root_dir / marker).exists():
                detected.append(ptype)
                break
    return detected


def find_directories(root_dir: Path) -> dict:
    """查找项目目录结构"""
    found = {cat: [] for cat in COMMON_DIRS.keys()}
    
    for item in root_dir.iterdir():
        if item.is_dir() and not item.name.startswith("."):
            for cat, names in COMMON_DIRS.items():
                if item.name.lower() in names:
                    found[cat].append(item.name)
                    
    return found


def find_config_files(root_dir: Path) -> list:
    """查找配置文件"""
    found = []
    for config in CONFIG_FILES:
        path = root_dir / config
        if path.exists():
            found.append(config)
    return found


def analyze_package_json(root_dir: Path) -> dict:
    """分析 package.json"""
    pkg_path = root_dir / "package.json"
    if not pkg_path.exists():
        return {}
    
    try:
        with open(pkg_path, 'r', encoding='utf-8') as f:
            pkg = json.load(f)
        return {
            "name": pkg.get("name", ""),
            "description": pkg.get("description", ""),
            "scripts": list(pkg.get("scripts", {}).keys()),
            "dependencies": list(pkg.get("dependencies", {}).keys())[:10],
            "devDependencies": list(pkg.get("devDependencies", {}).keys())[:10],
        }
    except Exception:
        return {}


def analyze_pyproject(root_dir: Path) -> dict:
    """分析 pyproject.toml"""
    import tomllib
    
    pyproject_path = root_dir / "pyproject.toml"
    if not pyproject_path.exists():
        return {}
    
    try:
        with open(pyproject_path, 'rb') as f:
            data = tomllib.load(f)
        
        project = data.get("project", {})
        return {
            "name": project.get("name", ""),
            "description": project.get("description", ""),
            "dependencies": project.get("dependencies", [])[:10],
        }
    except Exception:
        return {}


def analyze_project(root_dir: Path) -> dict:
    """分析项目并返回结构化信息"""
    result = {
        "project_type": detect_project_type(root_dir),
        "directories": find_directories(root_dir),
        "config_files": find_config_files(root_dir),
    }
    
    # 根据项目类型添加特定分析
    if "node" in result["project_type"]:
        result["package_info"] = analyze_package_json(root_dir)
    if "python" in result["project_type"]:
        result["python_info"] = analyze_pyproject(root_dir)
    
    # 统计文件数量
    total_files = 0
    for item in root_dir.rglob("*"):
        if item.is_file() and not any(part.startswith(".") for part in item.parts):
            total_files += 1
            if total_files > 10000:  # 限制统计数量
                break
    result["approx_file_count"] = min(total_files, 10000)
    
    return result


def print_analysis(analysis: dict):
    """打印分析结果"""
    print("=" * 60)
    print("项目分析结果")
    print("=" * 60)
    
    print(f"\n📦 项目类型: {', '.join(analysis['project_type']) or '未知'}")
    print(f"📁 估计文件数: {analysis['approx_file_count']}")
    
    print("\n📂 目录结构:")
    for cat, dirs in analysis['directories'].items():
        if dirs:
            print(f"  {cat}: {', '.join(dirs)}")
    
    print("\n⚙️ 配置文件:")
    for config in analysis['config_files'][:10]:
        print(f"  - {config}")
    if len(analysis['config_files']) > 10:
        print(f"  ... 还有 {len(analysis['config_files']) - 10} 个")
    
    if "package_info" in analysis:
        info = analysis["package_info"]
        print(f"\n📋 Package.json:")
        print(f"  名称: {info.get('name', 'N/A')}")
        print(f"  描述: {info.get('description', 'N/A')[:50]}...")
        print(f"  可用脚本: {', '.join(info.get('scripts', [])[:5])}")
    
    if "python_info" in analysis:
        info = analysis["python_info"]
        print(f"\n📋 Python 项目:")
        print(f"  名称: {info.get('name', 'N/A')}")
        print(f"  描述: {info.get('description', 'N/A')[:50]}...")


def main():
    if len(sys.argv) > 1:
        root_dir = Path(sys.argv[1])
    else:
        root_dir = Path.cwd()
    
    if not root_dir.exists():
        print(f"错误: 目录不存在 {root_dir}")
        sys.exit(1)
    
    analysis = analyze_project(root_dir)
    print_analysis(analysis)
    
    # 输出 JSON 格式供程序解析
    print("\n" + "=" * 60)
    print("JSON 输出:")
    print("=" * 60)
    print(json.dumps(analysis, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
